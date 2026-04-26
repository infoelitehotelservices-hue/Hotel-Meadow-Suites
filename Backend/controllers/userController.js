import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import generateOtp from '../utils/otp_generator.js';
import { sendVerificationEmail, sendForgotPasswordEmail } from '../utils/smtp_function.js';
import CryptoJs from 'crypto-js';

export const getUser = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 }); // Exclude sensitive fields
    res.status(200).json(users); 
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const verifyAccount = async (req, res) => {
  const userOtp = req.params.otp;
  try {
      const user = await User.findOne({ otp: userOtp });

      if (!user) {
          return res.status(400).json({ status: false, message: 'Invalid or expired OTP' });
      }

      if (user.verification) {
          return res.status(400).json({ status: false, message: 'Account is already verified' });
      }

      user.verification = true;
      user.otp = "none";
      await user.save();

      const userToken = jwt.sign({
          id: user._id,
          userType: user.userType,
          username: user.username,
          email: user.email,
          verification: true,
      }, process.env.JWT_SECRET, { expiresIn: "21d" });

      res.status(200).json({ status: true, message: "Account verified successfully", userToken });
  } catch (error) {
      res.status(500).json({ status: false, message: "Something went wrong" });
  }
}

export const deleteUser = async (req, res) => {
  try {
      const userId = req.params.userId; // Get userId from route params
      if (!userId) {
          return res.status(400).json({ status: false, message: "User ID is required" });
      }

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
          return res.status(404).json({ status: false, message: "User not found" });
      }

      res.status(200).json({ status: true, message: "User deleted successfully" });
  } catch (error) {
      res.status(500).json({ status: false, message: error.message });
  }
};


export const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (user.verification) {
      return res.status(400).json({ status: false, message: "Account is already verified" });
    }

    const otp = generateOtp();
    user.otp = otp;
    await user.save();

    await sendVerificationEmail(user.email, otp);

    res.status(200).json({ status: true, message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
        const { email } = req.body;
      
        if (!email) {
          return res.status(400).json({ status: false, message: "Email is required" });
        }
      
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
          }
      
          // Generate OTP and save to user record
          const otp = generateOtp();
          user.otp = otp;
          await user.save();
      
          // Send OTP via email
          await sendForgotPasswordEmail(user.email, otp);
      
          res.status(200).json({ status: true, message: "OTP sent to your email" });
        } catch (error) {
          res.status(500).json({ status: false, message: error.message });
        }
      };
      
      export const resetPassword = async (req, res) => {
        const { email, otp, newPassword } = req.body;
      
        if (!email || !otp || !newPassword) {
          return res.status(400).json({ status: false, message: "All fields are required" });
        }

        if (newPassword.length < 8) {
          return res.status(400).json({ status: false, message: "Password must be at least 8 characters long" });
        }
      
        try {
          const user = await User.findOne({ email });
      
          if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
          }
      
          if (user.otp !== otp) {
            return res.status(400).json({ status: false, message: "Invalid OTP" });
          }
      
          // Update password
          user.password = CryptoJs.AES.encrypt(newPassword, process.env.SECRET).toString();
          user.otp = "none";
          await user.save();
      
          res.status(200).json({ status: true, message: "Password reset successfully" });
        } catch (error) {
          res.status(500).json({ status: false, message: error.message });
        }
      };