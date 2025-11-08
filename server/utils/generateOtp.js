// ✅ Generate a 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ In-memory OTP store (temporary for dev)
const otpStore = new Map();

/**
 * Store an OTP tied to a specific identifier (e.g., email or phone)
 * Expires after 10 minutes
 */
export function storeOTP(identifier, otp) {
  otpStore.set(identifier, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Verify OTP
 * Returns an object { valid: boolean, message: string }
 */
export function verifyOTP(identifier, otp) {
  const stored = otpStore.get(identifier);

  if (!stored) {
    return { valid: false, message: "OTP not found or expired" };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(identifier);
    return { valid: false, message: "OTP expired" };
  }

  if (stored.otp !== otp) {
    return { valid: false, message: "Invalid OTP" };
  }

  otpStore.delete(identifier);
  return { valid: true, message: "OTP verified successfully" };
}
