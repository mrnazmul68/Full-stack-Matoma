const crypto = require('crypto');

const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = 2 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

const generateOtp = (length = OTP_LENGTH) => {
  const minimum = 10 ** (length - 1);
  const maximum = 10 ** length;

  return crypto.randomInt(minimum, maximum).toString();
};

const getOtpExpiryDate = () => new Date(Date.now() + OTP_EXPIRY_MS);

const getOtpRetryAfterSeconds = (lastSentAt) => {
  if (!lastSentAt) {
    return 0;
  }

  const elapsedMs = Date.now() - lastSentAt.getTime();

  if (elapsedMs >= OTP_RESEND_COOLDOWN_MS) {
    return 0;
  }

  return Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsedMs) / 1000);
};

module.exports = {
  generateOtp,
  getOtpExpiryDate,
  getOtpRetryAfterSeconds,
  OTP_EXPIRY_MS,
  OTP_LENGTH,
  OTP_RESEND_COOLDOWN_MS,
};
