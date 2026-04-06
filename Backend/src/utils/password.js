const crypto = require('crypto');

const KEY_LENGTH = 64;

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  if (!storedPassword || !storedPassword.includes(':')) {
    return false;
  }

  const [salt, originalHash] = storedPassword.split(':');
  const incomingHash = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');

  return crypto.timingSafeEqual(
    Buffer.from(originalHash, 'hex'),
    Buffer.from(incomingHash, 'hex')
  );
}

module.exports = {
  hashPassword,
  verifyPassword,
};
