const nodemailer = require('nodemailer');

let cachedTransporter = null;
let cachedTransportKey = '';

const normalizeBoolean = (value) => String(value).trim().toLowerCase() === 'true';
const normalizeEnvValue = (value) => String(value || '').trim();
const normalizeSmtpPassword = (value) => normalizeEnvValue(value).replace(/\s+/g, '');

function getMailConfig() {
  const {
    SMTP_HOST,
    SMTP_PORT = '465',
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM,
    SMTP_SECURE,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    throw new Error(
      'SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM must be configured to send verification emails.',
    );
  }

  const port = Number(SMTP_PORT);

  if (Number.isNaN(port)) {
    throw new Error('SMTP_PORT must be a valid number.');
  }

  return {
    host: normalizeEnvValue(SMTP_HOST),
    port,
    secure: SMTP_SECURE ? normalizeBoolean(SMTP_SECURE) : port === 465,
    auth: {
      user: normalizeEnvValue(SMTP_USER),
      pass: normalizeSmtpPassword(SMTP_PASSWORD),
    },
    from: normalizeEnvValue(SMTP_FROM),
  };
}

function getTransporter() {
  const config = getMailConfig();
  const transportKey = JSON.stringify({
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
    from: config.from,
  });

  if (!cachedTransporter || cachedTransportKey !== transportKey) {
    cachedTransportKey = transportKey;
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }

  return {
    transporter: cachedTransporter,
    from: config.from,
  };
}

async function sendRegistrationVerificationEmail({ email, name, code }) {
  const { transporter, from } = getTransporter();
  const recipientName = name?.trim() || 'there';

  await transporter.sendMail({
    from,
    to: email,
    subject: 'Your Matoma OTP code',
    text: [
      `Hello ${recipientName},`,
      '',
      `Your Matoma OTP is ${code}.`,
      'This OTP will expire in 2 minutes.',
      '',
      'If you did not request this code, you can ignore this email.',
      '',
      'Matoma',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; background: #050505; color: #ffffff; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; background: rgba(255,255,255,0.03); padding: 28px;">
          <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: tomato;">Matoma</p>
          <h1 style="margin: 0 0 16px; font-size: 28px; line-height: 1.2;">Verify your email</h1>
          <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.7; color: #d4d4d4;">
            Hello ${recipientName}, use this OTP to finish creating your Matoma account.
          </p>
          <div style="margin: 0 0 20px; padding: 18px 20px; border-radius: 16px; background: rgba(255,99,71,0.12); border: 1px solid rgba(255,99,71,0.3); text-align: center;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 0.32em; color: #ffffff;">${code}</span>
          </div>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #d4d4d4;">
            This OTP will expire in 2 minutes.
          </p>
          <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #9f9f9f;">
            If you did not request this code, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}

async function sendRegistrationOtpEmail({ email, otp, name }) {
  return sendRegistrationVerificationEmail({
    email,
    name,
    code: otp,
  });
}

module.exports = {
  sendRegistrationOtpEmail,
  sendRegistrationVerificationEmail,
};
