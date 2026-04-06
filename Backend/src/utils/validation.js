const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email = '') => EMAIL_REGEX.test(String(email).trim().toLowerCase());

module.exports = {
  isValidEmail,
};
