const generateOtp = () => {
  return Math.floor(10000 + Math.random() * 900000).toString();
};

const otpStore = new Map();

const storeOTP = (identifier, otp) => {
  otpStore.set(identifier, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
};

const verifyOTP = (identifier, otp) => {
  const stored = otpStore.get(identifier);
  
  if (!stored) {
    return { valid: false, message: 'OTP not found or expired' };
  }
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(identifier);
    return { valid: false, message: 'OTP expired' };
  }
  
  if (stored.otp !== otp) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  otpStore.delete(identifier);
  return { valid: true, message: 'OTP verified' };
};

export default {generateOtp,storeOTP,verifyOTP}
