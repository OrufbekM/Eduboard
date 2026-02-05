const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

const signupValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
  body('username').optional({ nullable: true, checkFalsy: true }).isLength({ min: 2, max: 30 }).withMessage('Username must be 2-30 characters').trim(),
  body('fullName').optional({ nullable: true, checkFalsy: true }).isLength({ min: 2, max: 80 }).withMessage('Full name must be 2-80 characters').trim(),
  body('phoneNumber').optional({ nullable: true, checkFalsy: true }).isLength({ min: 6, max: 20 }).withMessage('Phone number must be 6-20 characters').trim()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required')
];

const updateProfileValidation = [
  body('username').optional({ nullable: true, checkFalsy: true }).isLength({ min: 2, max: 30 }).withMessage('Username must be 2-30 characters').trim(),
  body('fullName').optional({ nullable: true, checkFalsy: true }).isLength({ min: 2, max: 80 }).withMessage('Full name must be 2-80 characters').trim(),
  body('phoneNumber').optional({ nullable: true, checkFalsy: true }).isLength({ min: 6, max: 20 }).withMessage('Phone number must be 6-20 characters').trim()
];

const resetPasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required')
];

router.post('/signup', signupValidation, AuthController.signup);
router.post('/login', loginValidation, AuthController.login);
router.post('/refresh-token', refreshTokenValidation, AuthController.refreshToken);
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/profile', authMiddleware, updateProfileValidation, AuthController.updateProfile);
router.post('/reset-password', authMiddleware, resetPasswordValidation, AuthController.resetPassword);

module.exports = router;
