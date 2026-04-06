const normalizeEmail = (email = '') => email.trim().toLowerCase();

const getAdminConfig = () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be configured.',
    );
  }

  return {
    email: normalizeEmail(email),
    password,
  };
};

module.exports = {
  getAdminConfig,
  normalizeEmail,
};
