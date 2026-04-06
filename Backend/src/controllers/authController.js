const bcrypt = require('bcrypt');

const EmailOtp = require('../models/EmailOtp');
const EmailVerificationToken = require('../models/EmailVerificationToken');
const User = require('../models/User');
const { hashPassword, verifyPassword } = require('../utils/password');
const { serializeUser } = require('../utils/serializeUser');
const { sendRegistrationOtpEmail } = require('../utils/emailService');
const {
  createEmailVerificationToken,
  getEmailVerificationTokenExpiryDate,
  hashEmailVerificationToken,
  EMAIL_VERIFICATION_TOKEN_EXPIRY_MS,
} = require('../utils/emailVerificationToken');
const {
  generateOtp,
  getOtpExpiryDate,
  getOtpRetryAfterSeconds,
} = require('../utils/otp');
const { isValidEmail } = require('../utils/validation');
const {
  getAdminConfig,
  normalizeEmail,
} = require('../utils/adminSession');
const {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  USER_COOKIE_NAME,
  createAuthSession,
  deleteAuthSession,
  findAuthSession,
  getUserSessionMaxAge,
  parseCookies,
  serializeClearedSessionCookie,
  serializeSessionCookie,
} = require('../utils/sessionStore');

const BCRYPT_SALT_ROUNDS = 10;
const PASSWORD_MIN_LENGTH = 6;
const SMTP_ERROR_CODES = new Set(['EAUTH', 'ECONNECTION', 'ESOCKET', 'ETIMEDOUT']);

const clearExistingSessions = async (cookies) =>
  Promise.all([
    deleteAuthSession(cookies[USER_COOKIE_NAME], 'user'),
    deleteAuthSession(cookies[ADMIN_COOKIE_NAME], 'admin'),
  ]);

const createUserSessionResponse = async (req, res, user, rememberMe = true) => {
  const cookies = parseCookies(req.headers.cookie);
  const userSessionMaxAge = getUserSessionMaxAge(rememberMe);

  await clearExistingSessions(cookies);

  const userSession = await createAuthSession({
    role: 'user',
    userId: user._id,
    email: user.email,
    maxAgeSeconds: userSessionMaxAge,
  });

  res.setHeader('Set-Cookie', [
    serializeSessionCookie(USER_COOKIE_NAME, userSession.token, userSessionMaxAge),
    serializeClearedSessionCookie(ADMIN_COOKIE_NAME),
  ]);
};

const createOtpDeliveryError = (error) => {
  const otpDeliveryError = new Error('Unable to send the OTP email right now. Please try again later.');
  otpDeliveryError.statusCode = 502;

  if (error?.code === 'EAUTH') {
    otpDeliveryError.message =
      'Email delivery is not configured correctly. Please update your Gmail App Password and try again.';
  } else if (SMTP_ERROR_CODES.has(error?.code)) {
    otpDeliveryError.message =
      'Unable to reach the email service right now. Please try again in a moment.';
  }

  return otpDeliveryError;
};

const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail }).select('_id');

    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    const existingOtp = await EmailOtp.findOne({ email: normalizedEmail });
    const retryAfterSeconds = getOtpRetryAfterSeconds(existingOtp?.lastSentAt);

    if (retryAfterSeconds > 0) {
      return res.status(429).json({
        message: `Please wait ${retryAfterSeconds} seconds before requesting a new OTP.`,
        retryAfterSeconds,
      });
    }

    await Promise.all([
      EmailOtp.deleteOne({ email: normalizedEmail }),
      EmailVerificationToken.deleteOne({ email: normalizedEmail }),
    ]);

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, BCRYPT_SALT_ROUNDS);

    await EmailOtp.create({
      email: normalizedEmail,
      otpHash,
      expiresAt: getOtpExpiryDate(),
      lastSentAt: new Date(),
    });

    try {
      await sendRegistrationOtpEmail({
        email: normalizedEmail,
        otp,
      });
    } catch (error) {
      await EmailOtp.deleteOne({ email: normalizedEmail });
      throw createOtpDeliveryError(error);
    }

    return res.status(200).json({
      message: 'OTP sent successfully. Please check your email.',
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, code } = req.body;

    if (!email || (!otp && !code)) {
      return res.status(400).json({
        message: 'Email and OTP are required.',
      });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail }).select('_id');

    if (existingUser) {
      await Promise.all([
        EmailOtp.deleteOne({ email: normalizedEmail }),
        EmailVerificationToken.deleteOne({ email: normalizedEmail }),
      ]);

      return res.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    const otpRecord = await EmailOtp.findOne({ email: normalizedEmail });

    if (!otpRecord) {
      return res.status(400).json({
        message: 'The OTP is invalid or expired. Please request a new one.',
      });
    }

    if (otpRecord.expiresAt <= new Date()) {
      await EmailOtp.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        message: 'The OTP is invalid or expired. Please request a new one.',
      });
    }

    const incomingOtp = String(otp || code).trim();
    const isOtpValid = await bcrypt.compare(incomingOtp, otpRecord.otpHash);

    if (!isOtpValid) {
      return res.status(400).json({
        message: 'The OTP is invalid or expired.',
      });
    }

    const verificationToken = createEmailVerificationToken();

    await Promise.all([
      EmailOtp.deleteOne({ _id: otpRecord._id }),
      EmailVerificationToken.deleteOne({ email: normalizedEmail }),
    ]);

    await EmailVerificationToken.create({
      email: normalizedEmail,
      tokenHash: hashEmailVerificationToken(verificationToken),
      expiresAt: getEmailVerificationTokenExpiryDate(),
      verifiedAt: new Date(),
    });

    return res.status(200).json({
      message: 'Email verified successfully.',
      verified: true,
      verificationToken,
      verificationTokenExpiresInSeconds: Math.floor(
        EMAIL_VERIFICATION_TOKEN_EXPIRY_MS / 1000,
      ),
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      verificationToken,
      rememberMe = true,
    } = req.body;

    if (!name || !email || !password || !confirmPassword || !verificationToken) {
      return res.status(400).json({
        message:
          'Name, email, password, confirm password, and verification token are required.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({
        message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const trimmedName = name.trim();

    if (!trimmedName) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail }).select('_id');

    if (existingUser) {
      await EmailVerificationToken.deleteOne({ email: normalizedEmail });

      return res.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    const verificationRecord = await EmailVerificationToken.findOne({
      email: normalizedEmail,
      tokenHash: hashEmailVerificationToken(verificationToken),
      expiresAt: { $gt: new Date() },
    });

    if (!verificationRecord) {
      return res.status(403).json({
        message: 'Email verification is required before creating an account.',
      });
    }

    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashPassword(password),
    });

    await Promise.all([
      EmailVerificationToken.deleteOne({ _id: verificationRecord._id }),
      EmailOtp.deleteOne({ email: normalizedEmail }),
    ]);

    await createUserSessionResponse(req, res, user, rememberMe);

    return res.status(201).json({
      message: 'Account created successfully.',
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe = true } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = normalizeEmail(email);
    let adminConfig = null;

    try {
      adminConfig = getAdminConfig();
    } catch (error) {
      adminConfig = null;
    }

    if (
      adminConfig &&
      normalizedEmail === adminConfig.email &&
      password === adminConfig.password
    ) {
      const cookies = parseCookies(req.headers.cookie);

      await clearExistingSessions(cookies);

      const adminSession = await createAuthSession({
        role: 'admin',
        email: adminConfig.email,
        maxAgeSeconds: ADMIN_SESSION_MAX_AGE_SECONDS,
      });

      res.setHeader('Set-Cookie', [
        serializeSessionCookie(
          ADMIN_COOKIE_NAME,
          adminSession.token,
          ADMIN_SESSION_MAX_AGE_SECONDS,
        ),
        serializeClearedSessionCookie(USER_COOKIE_NAME),
      ]);

      return res.json({
        message: 'Admin login successful.',
        role: 'admin',
        admin: {
          email: adminConfig.email,
          role: 'admin',
        },
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: 'This account has been blocked. Please contact the admin.',
      });
    }

    await createUserSessionResponse(req, res, user, rememberMe);

    return res.json({
      message: 'Login successful.',
      role: 'user',
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: 'This account has been blocked. Please contact the admin.',
      });
    }

    const resetToken = generateOtp();

    user.passwordResetToken = resetToken;
    user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return res.json({
      message: 'Reset code generated successfully.',
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, rememberMe = true } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Reset code and new password are required.' });
    }

    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({
        message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
      });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: 'This account has been blocked. Please contact the admin.',
      });
    }

    user.password = hashPassword(newPassword);
    user.passwordResetToken = null;
    user.passwordResetExpiresAt = null;
    await user.save();

    await createUserSessionResponse(req, res, user, rememberMe);

    return res.json({
      message: 'Password reset successful.',
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const getSession = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[USER_COOKIE_NAME];
    const userSession = await findAuthSession(token, 'user');

    if (!userSession || !userSession.userId) {
      res.setHeader('Set-Cookie', serializeClearedSessionCookie(USER_COOKIE_NAME));
      return res.json({
        user: null,
      });
    }

    const user = await User.findById(userSession.userId);

    if (!user) {
      await deleteAuthSession(token, 'user');
      res.setHeader('Set-Cookie', serializeClearedSessionCookie(USER_COOKIE_NAME));
      return res.json({
        user: null,
      });
    }

    if (user.isBlocked) {
      await deleteAuthSession(token, 'user');
      res.setHeader('Set-Cookie', serializeClearedSessionCookie(USER_COOKIE_NAME));
      return res.json({
        user: null,
      });
    }

    return res.json({
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    await deleteAuthSession(cookies[USER_COOKIE_NAME], 'user');
    res.setHeader('Set-Cookie', serializeClearedSessionCookie(USER_COOKIE_NAME));

    return res.json({
      message: 'Logout successful.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  forgotPassword,
  getSession,
  login,
  logout,
  register,
  resetPassword,
  sendOtp,
  verifyOtp,
};
