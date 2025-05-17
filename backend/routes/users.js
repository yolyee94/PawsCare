import express from 'express';
import User from '../models/Users.js';

const router = express.Router();

// POST - Create a new customer
router.post('/', async (req, res) => {
  try {
    const customer = new User(req.body);
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Get all customers
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update customer details
router.put('/:id', async (req, res) => {
  try {
    const updatedCustomer = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Forgot Password API
import nodemailer from 'nodemailer';

// POST - Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    // Generate a new reset token and expiry (1 hour)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Update user with new token and expiry
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "smilebat96@gmail.com",
        pass: "aexk knbl ceiz mfmn",
      },
    });

    // Email content with timestamp to ensure uniqueness
    const timestamp = Date.now();
    const baseUrl = 'file:///C:/Github/PawsCare/reset-password.html';
    const resetLink = `${baseUrl}?resetToken=${resetToken}&email=${email.replace('@', '@')}&t=${timestamp}`;
    
    const mailOptions = {
      from: 'Paws and Care',
      to: email,
      subject: `Password Reset Request - PawsCare (${new Date().toLocaleString()})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Password Reset Request</h2>
          <p>Dear ${user.name || 'User'},</p>
          <p>We received a request to reset your password for your PawsCare account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #4CAF50; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 4px;
                      display: inline-block;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
            ${resetLink}
          </p>
          <p><strong>Note:</strong> This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Best regards,<br>
            The PawsCare Team
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true,
      message: 'Password reset link has been sent to your email.' 
    });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while processing your request.' 
    });
  }
});

// POST - Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    // Validate required fields
    if (!email || !newPassword || !resetToken) {
      return res.status(400).json({ 
        success: false,
        message: 'Email, new password, and reset token are required.' 
      });
    }

    // Find user by email and reset token
    const user = await User.findOne({ 
      email,
      resetToken,
      resetTokenExpiry: { $gt: Date.now() } // Check if token hasn't expired
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired reset token. Please request a new password reset.' 
      });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ 
      success: true,
      message: 'Password has been reset successfully.' 
    });
  } catch (error) {
    console.error('Error in reset-password:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while resetting your password.' 
    });
  }
});

export default router;