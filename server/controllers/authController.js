import User from "../models/User.js";
import sendEmail from "../utils/sendMail.js";
import { generateOTP, storeOTP, verifyOTP } from "../utils/generateOtp.js";
import { randomBytes, createHash } from "crypto";

/**
 * @desc Register new user
 * @route POST /api/auth/register
 * @access Public
 */
export async function register(req, res, next) {
  try {
    const { name, email, phone, password, address, location } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }

    // 2️⃣ Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      address,
      location,
    });

    // 3️⃣ Generate OTP for email verification
    const otp = generateOTP();
    storeOTP(email, otp);

    // 4️⃣ Send verification email
    const emailHTML = `
      <h1>Welcome to Grievance Portal!</h1>
      <p>Hi ${name},</p>
      <p>Your account has been created successfully.</p>
      <p>Your OTP for email verification is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
      <p>Thank you!</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Email Verification - Grievance Portal",
        html: emailHTML,
      });
    } catch (err) {
      console.error("❌ Email sending failed:", err.message);
    }

    // 5️⃣ Generate JWT token
    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Login user
 * @route POST /api/auth/login
 * @access Public
 */
export async function login(req, res, next) {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email/phone and password",
      });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        department: user.department,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Verify email with OTP
 * @route POST /api/auth/verify-otp
 * @access Private
 */
export async function verifyOtp(req, res, next) {
  try {
    const { otp } = req.body;
    const user = req.user;

    const verification = verifyOTP(user.email, otp);

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message,
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Resend OTP
 * @route POST /api/auth/resend-otp
 * @access Private
 */
export async function resendOtp(req, res, next) {
  try {
    const user = req.user;

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const otp = generateOTP();
    storeOTP(user.email, otp);

    const emailHTML = `
      <h1>Email Verification</h1>
      <p>Hi ${user.name},</p>
      <p>Your new OTP is: <strong>${otp}</strong></p>
      <p>Valid for 10 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Email Verification OTP - Grievance Portal",
      html: emailHTML,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Forgot password
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
      });
    }

    const resetToken = randomBytes(20).toString("hex");

    user.resetPasswordToken = createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 min

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const emailHTML = `
      <h1>Password Reset Request</h1>
      <p>Hi ${user.name},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link is valid for 30 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request - Grievance Portal",
      html: emailHTML,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Reset password
 * @route PUT /api/auth/reset-password/:resetToken
 * @access Public
 */
export async function resetPassword(req, res, next) {
  try {
    const { password } = req.body;

    const resetPasswordToken = createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
      token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id).populate("department", "name code");
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Update profile
 * @route PUT /api/auth/update-profile
 * @access Private
 */
export async function updateProfile(req, res, next) {
  try {
    const { name, phone, address, location } = req.body;
    const fieldsToUpdate = {};

    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;
    if (address) fieldsToUpdate.address = address;
    if (location) fieldsToUpdate.location = location;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Update password
 * @route PUT /api/auth/update-password
 * @access Private
 */
export async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Logout user
 * @route POST /api/auth/logout
 * @access Private
 */
export async function logout(req, res, next) {
  try {
    // In a real application, token invalidation/blacklisting can be added here.
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}
