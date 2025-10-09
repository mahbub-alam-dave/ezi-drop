// lib/otp.js
import crypto from 'crypto';

export function generateOtp(length = 6) {
  // numeric OTP with leading zeros possible
  const max = Math.pow(10, length) - 1;
  const num = Math.floor(Math.random() * (max + 1));
  return num.toString().padStart(length, '0');
}

export function hashOtp(otp) {
  // Add a server secret salt
  const secret = process.env.OTP_SECRET || 'change_this';
  return crypto.createHmac('sha256', secret).update(otp).digest('hex');
}
