import express from 'express';
import User from '../models/Users.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const client = new OAuth2Client({
    clientId: '680557439747-ahlqecb6np67qul6d8mflquk4elvrf4g.apps.googleusercontent.com',
    clientSecret: 'GOCSPX-YourClientSecretHere', // Replace with your actual client secret
    redirectUri: 'http://localhost:3000/api/users/google-callback'
});

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

// POST - Google Login
router.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: 'Google token is required.' 
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '680557439747-ahlqecb6np67qul6d8mflquk4elvrf4g.apps.googleusercontent.com'
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        email,
        name,
        profilePicture: picture,
        googleId,
        isGoogleUser: true
      });
      await user.save();
    } else if (!user.googleId) {
      // Update existing user with Google info
      user.googleId = googleId;
      user.isGoogleUser = true;
      user.profilePicture = picture;
      await user.save();
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        isGoogleUser: user.isGoogleUser
      }
    });
  } catch (error) {
    console.error('Error in google-login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to authenticate with Google.' 
    });
  }
});

// Add Google OAuth callback route
router.get('/google-callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ 
        success: false,
        message: 'Authorization code is required.' 
      });
    }

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info
    const userInfo = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });

    const { email, name, picture, sub: googleId } = userInfo.data;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        email,
        name,
        profilePicture: picture,
        googleId,
        isGoogleUser: true
      });
      await user.save();
    } else if (!user.googleId) {
      // Update existing user with Google info
      user.googleId = googleId;
      user.isGoogleUser = true;
      user.profilePicture = picture;
      await user.save();
    }

    // Redirect to frontend with user data
    res.redirect(`http://localhost:3000/auth-success?user=${encodeURIComponent(JSON.stringify({
      id: user._id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      isGoogleUser: user.isGoogleUser
    }))}`);
  } catch (error) {
    console.error('Error in google-callback:', error);
    res.redirect('http://localhost:3000/auth-error');
  }
});

export default router;