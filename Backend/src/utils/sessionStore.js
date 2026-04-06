const crypto = require('crypto');
const AuthSession = require('../models/AuthSession');

const USER_COOKIE_NAME = 'matoma_user_session';
const ADMIN_COOKIE_NAME = 'matoma_admin_session';
const USER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const USER_SESSION_SHORT_MAX_AGE_SECONDS = 60 * 60 * 24;
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

const parseCookies = (cookieHeader = '') =>
  cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separatorIndex = part.indexOf('=');

      if (separatorIndex === -1) {
        return cookies;
      }

      const key = part.slice(0, separatorIndex).trim();
      const value = part.slice(separatorIndex + 1).trim();

      if (key) {
        cookies[key] = decodeURIComponent(value);
      }

      return cookies;
    }, {});

const hashSessionToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const createSessionToken = () => crypto.randomBytes(32).toString('base64url');

const createCookieOptions = (maxAgeSeconds) => {
  const attributes = [
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];

  if (process.env.NODE_ENV === 'production') {
    attributes.push('Secure');
  }

  return attributes.join('; ');
};

const serializeSessionCookie = (cookieName, token, maxAgeSeconds) =>
  `${cookieName}=${encodeURIComponent(token)}; ${createCookieOptions(maxAgeSeconds)}`;

const serializeClearedSessionCookie = (cookieName) =>
  `${cookieName}=; ${createCookieOptions(0)}`;

const getUserSessionMaxAge = (rememberMe = true) =>
  rememberMe ? USER_SESSION_MAX_AGE_SECONDS : USER_SESSION_SHORT_MAX_AGE_SECONDS;

const createAuthSession = async ({
  role,
  userId = null,
  email = '',
  maxAgeSeconds,
}) => {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);

  await AuthSession.create({
    tokenHash: hashSessionToken(token),
    role,
    userId,
    email: email.trim().toLowerCase(),
    expiresAt,
  });

  return {
    token,
    expiresAt,
  };
};

const findAuthSession = async (token, role) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  return AuthSession.findOne({
    tokenHash: hashSessionToken(token),
    role,
    expiresAt: { $gt: new Date() },
  });
};

const deleteAuthSession = async (token, role) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  return AuthSession.findOneAndDelete({
    tokenHash: hashSessionToken(token),
    role,
  });
};

const deleteUserSessions = async (userId) =>
  AuthSession.deleteMany({
    role: 'user',
    userId,
  });

module.exports = {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  USER_COOKIE_NAME,
  createAuthSession,
  deleteAuthSession,
  deleteUserSessions,
  findAuthSession,
  getUserSessionMaxAge,
  parseCookies,
  serializeClearedSessionCookie,
  serializeSessionCookie,
};
