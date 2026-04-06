const crypto = require('crypto');

const EMAIL_VERIFICATION_TOKEN_EXPIRY_MS = 10 * 60 * 1000;

const createEmailVerificationToken = () => crypto.randomBytes(32).toString('hex');

const hashEmailVerificationToken = (token) =>
  crypto.createHash('sha256').update(String(token)).digest('hex');

const getEmailVerificationTokenExpiryDate = () =>
  new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_MS);

module.exports = {
  createEmailVerificationToken,
  getEmailVerificationTokenExpiryDate,
  hashEmailVerificationToken,
  EMAIL_VERIFICATION_TOKEN_EXPIRY_MS,
};
