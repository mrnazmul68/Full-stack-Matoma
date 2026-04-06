const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const { requireAdmin } = require('../middleware/requireAdmin');
const { serializeUser } = require('../utils/serializeUser');
const { getAdminConfig, normalizeEmail } = require('../utils/adminSession');
const {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  USER_COOKIE_NAME,
  createAuthSession,
  deleteAuthSession,
  deleteUserSessions,
  findAuthSession,
  parseCookies,
  serializeClearedSessionCookie,
  serializeSessionCookie,
} = require('../utils/sessionStore');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Admin email and password are required.',
      });
    }

    const adminConfig = getAdminConfig();

    if (
      normalizeEmail(email) !== adminConfig.email ||
      password !== adminConfig.password
    ) {
      return res.status(401).json({
        message: 'Invalid admin email or password.',
      });
    }

    const cookies = parseCookies(req.headers.cookie);

    await Promise.all([
      deleteAuthSession(cookies[ADMIN_COOKIE_NAME], 'admin'),
      deleteAuthSession(cookies[USER_COOKIE_NAME], 'user'),
    ]);

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
      admin: {
        email: adminConfig.email,
        role: 'admin',
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/session', async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[ADMIN_COOKIE_NAME];
    const adminSession = await findAuthSession(token, 'admin');
    let adminConfig = null;

    try {
      adminConfig = getAdminConfig();
    } catch (error) {
      adminConfig = null;
    }

    if (
      !adminConfig ||
      !adminSession ||
      normalizeEmail(adminSession.email) !== adminConfig.email
    ) {
      res.setHeader('Set-Cookie', serializeClearedSessionCookie(ADMIN_COOKIE_NAME));
      return res.json({
        admin: null,
      });
    }

    return res.json({
      admin: {
        email: adminSession.email,
        role: adminSession.role,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  await deleteAuthSession(cookies[ADMIN_COOKIE_NAME], 'admin');
  res.setHeader('Set-Cookie', serializeClearedSessionCookie(ADMIN_COOKIE_NAME));

  return res.json({
    message: 'Admin logout successful.',
  });
});

router.get('/users', requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return res.json({
      users: users.map(serializeUser),
    });
  } catch (error) {
    return next(error);
  }
});

router.patch('/users/:userId/block', requireAdmin, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: 'Invalid user id.',
      });
    }

    if (typeof isBlocked !== 'boolean') {
      return res.status(400).json({
        message: 'A valid block status is required.',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    user.isBlocked = isBlocked;
    await user.save();

    if (isBlocked) {
      await deleteUserSessions(user._id);
    }

    return res.json({
      message: isBlocked ? 'User blocked successfully.' : 'User unblocked successfully.',
      user: serializeUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

router.delete('/users/:userId', requireAdmin, async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: 'Invalid user id.',
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    await deleteUserSessions(user._id);

    return res.json({
      message: 'User removed successfully.',
      user: serializeUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
