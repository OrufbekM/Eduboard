const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { User } = db;

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '14d' }
  );
  
  return { accessToken, refreshToken };
};

class AuthController {
  static async signup(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, confirmPassword, username, fullName, phoneNumber } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const normalizedUsername = username === '' ? null : username;
      const normalizedFullName = fullName === '' ? null : fullName;
      const normalizedPhoneNumber = phoneNumber === '' ? null : phoneNumber;

      const user = await User.create({
        email,
        password,
        username: normalizedUsername,
        fullName: normalizedFullName,
        phoneNumber: normalizedPhoneNumber
      });
      const { accessToken, refreshToken } = generateTokens(user);
      
      user.refreshToken = refreshToken;
      await user.save();

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const { accessToken, refreshToken } = generateTokens(user);
      
      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        message: 'Login successful',
        user: { id: user.id, email: user.email },
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
      }

      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      
      const user = await User.findByPk(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
      
      user.refreshToken = newRefreshToken;
      await user.save();

      res.json({
        accessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

  static async logout(req, res) {
    try {
      const userId = req.user?.id || req.userId;
      
      const user = await User.findByPk(userId);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }

      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getProfile(req, res) {
    try {
      const userId = req.user?.id || req.userId;
      const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'username', 'fullName', 'phoneNumber']
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user?.id || req.userId;
      const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'username', 'fullName', 'phoneNumber']
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { username, fullName, phoneNumber } = req.body || {};
      const normalizedUsername = username === '' ? null : username;
      const normalizedFullName = fullName === '' ? null : fullName;
      const normalizedPhoneNumber = phoneNumber === '' ? null : phoneNumber;

      if (username !== undefined) user.username = normalizedUsername;
      if (fullName !== undefined) user.fullName = normalizedFullName;
      if (phoneNumber !== undefined) user.phoneNumber = normalizedPhoneNumber;

      await user.save();

      res.json({ user });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async resetPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user?.id || req.userId;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New password and confirm password do not match' });
      }

      const isValidPassword = await user.validatePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      user.password = newPassword;
      user.refreshToken = null;
      await user.save();

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;
