const {
  ADMIN_COOKIE_NAME,
  findAuthSession,
  parseCookies,
} = require('../utils/sessionStore');
const { getAdminConfig, normalizeEmail } = require('../utils/adminSession');

async function requireAdmin(req, res, next) {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[ADMIN_COOKIE_NAME];
    const adminSession = await findAuthSession(token, 'admin');

    if (!adminSession) {
      return res.status(401).json({
        message: 'Admin authentication is required.',
      });
    }

    const adminConfig = getAdminConfig();

    if (normalizeEmail(adminSession.email) !== adminConfig.email) {
      return res.status(401).json({
        message: 'Admin authentication is required.',
      });
    }

    req.admin = {
      email: adminSession.email,
      role: 'admin',
      sessionId: adminSession._id.toString(),
    };
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  requireAdmin,
};
