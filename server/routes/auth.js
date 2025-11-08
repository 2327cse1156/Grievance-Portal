import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import { protect } from "../middleware/auth.js";
import {
  register,
  login,
  verifyOtp,        // ✅ fixed case
  resendOtp,        // ✅ fixed case
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  updatePassword,
  logout,
} from "../controllers/authController.js";

const router = Router();

// Validation rules
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Valid 10-digit phone number is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("emailOrPhone").notEmpty().withMessage("Email or phone is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const otpValidation = [
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("Valid 6-digit OTP is required"),
];

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
];

const resetPasswordValidation = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const updatePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

// Routes
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/verify-otp", protect, otpValidation, validate, verifyOtp);  // ✅ fixed case
router.post("/resend-otp", protect, resendOtp);                           // ✅ fixed case
router.post("/forgot-password", forgotPasswordValidation, validate, forgotPassword);
router.put("/reset-password/:resetToken", resetPasswordValidation, validate, resetPassword);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.put("/update-password", protect, updatePasswordValidation, validate, updatePassword);
router.post("/logout", protect, logout);

export default router;
