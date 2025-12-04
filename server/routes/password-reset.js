/**
 * Password Reset Routes
 * Handles password reset tokens and password recovery flow
 */

const express = require('express')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const User = require('../models/User')
const PasswordReset = require('../models/PasswordReset')
const { body, validationResult } = require('express-validator')
const nodemailer = require('nodemailer')

const router = express.Router()

// Email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

/**
 * POST /api/password-reset/request
 * Request password reset email
 * @body {string} email - User email address
 */
router.post(
  '/request',
  body('email').isEmail().withMessage('Valid email is required'),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email } = req.body
      const user = await User.findOne({ email })

      if (!user) {
        // Don't reveal if email exists for security
        return res.json({ message: 'If email exists, password reset link sent' })
      }

      // Remove old tokens
      await PasswordReset.deleteMany({ userId: user._id })

      // Generate reset token
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

      // Save reset record
      const reset = new PasswordReset({
        userId: user._id,
        token,
        email: user.email,
        expiresAt,
      })
      await reset.save()

      // Send reset email
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Reset Your EduSync Password',
          html: `
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Click the link below to proceed:</p>
            <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
            <p>Or copy this link: ${resetLink}</p>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          `,
        })

        res.json({ message: 'If email exists, password reset link sent' })
      } catch (emailError) {
        console.error('Email send error:', emailError)
        res.status(500).json({ message: 'Failed to send reset email' })
      }
    } catch (error) {
      console.error('Password reset request error:', error)
      res.status(500).json({ message: 'Failed to process request', error: error.message })
    }
  }
)

/**
 * POST /api/password-reset/reset
 * Reset password using token
 * @body {string} token - Reset token
 * @body {string} password - New password (min 6 chars)
 * @body {string} confirmPassword - Password confirmation
 */
router.post(
  '/reset',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match')
      }
      return true
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { token, password } = req.body

      const reset = await PasswordReset.findOne({ token })

      if (!reset) {
        return res.status(400).json({ message: 'Invalid or expired token' })
      }

      if (reset.expiresAt < new Date()) {
        await PasswordReset.deleteOne({ _id: reset._id })
        return res.status(400).json({ message: 'Token has expired' })
      }

      if (reset.used) {
        return res.status(400).json({ message: 'Reset token already used' })
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Update user password
      await User.findByIdAndUpdate(reset.userId, {
        password: hashedPassword,
      })

      // Mark token as used
      reset.used = true
      reset.usedAt = new Date()
      await reset.save()

      // Send confirmation email
      const user = await User.findById(reset.userId)
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Password Reset Successful',
          html: `
            <h2>Password Reset Successful</h2>
            <p>Your password has been successfully reset.</p>
            <p>You can now log in with your new password.</p>
            <p>If you didn't make this change, please contact support immediately.</p>
          `,
        })
      } catch (emailError) {
        console.error('Confirmation email error:', emailError)
      }

      res.json({ message: 'Password reset successfully' })
    } catch (error) {
      console.error('Password reset error:', error)
      res.status(500).json({ message: 'Failed to reset password', error: error.message })
    }
  }
)

/**
 * POST /api/password-reset/change
 * Change password for authenticated user
 * @private
 * @body {string} currentPassword - Current password
 * @body {string} newPassword - New password (min 6 chars)
 * @body {string} confirmPassword - Password confirmation
 */
router.post(
  '/change',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match')
      }
      return true
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { currentPassword, newPassword } = req.body
      const user = await User.findById(req.user.id)

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' })
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      // Update password
      user.password = hashedPassword
      await user.save()

      res.json({ message: 'Password changed successfully' })
    } catch (error) {
      console.error('Change password error:', error)
      res.status(500).json({ message: 'Failed to change password', error: error.message })
    }
  }
)

module.exports = router
