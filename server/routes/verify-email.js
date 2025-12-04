/**
 * Email Verification Routes
 * Handles email verification tokens and verification flow
 */

const express = require('express')
const crypto = require('crypto')
const auth = require('../middleware/auth')
const User = require('../models/User')
const EmailVerification = require('../models/EmailVerification')
const { body, validationResult } = require('express-validator')
const nodemailer = require('nodemailer')

const router = express.Router()

// Email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

/**
 * POST /api/verify-email/send
 * Send verification email to user
 * @private
 */
router.post('/send', auth, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email already verified' })
    }

    // Remove old tokens
    await EmailVerification.deleteMany({ userId, email: user.email })

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Save verification record
    const verification = new EmailVerification({
      userId,
      token,
      email: user.email,
      expiresAt,
    })
    await verification.save()

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verify Your EduSync Email',
        html: `
          <h2>Welcome to EduSync!</h2>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationLink}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
          <p>Or copy this link: ${verificationLink}</p>
          <p>This link expires in 24 hours.</p>
          <p>If you didn't create this account, please ignore this email.</p>
        `,
      })

      res.json({ message: 'Verification email sent successfully' })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      res.status(500).json({ message: 'Failed to send verification email' })
    }
  } catch (error) {
    console.error('Send verification error:', error)
    res.status(500).json({ message: 'Failed to send verification email', error: error.message })
  }
})

/**
 * POST /api/verify-email/verify
 * Verify email using token
 * @body {string} token - Verification token
 */
router.post(
  '/verify',
  body('token').notEmpty().withMessage('Token is required'),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { token } = req.body

      const verification = await EmailVerification.findOne({ token })

      if (!verification) {
        return res.status(400).json({ message: 'Invalid or expired token' })
      }

      if (verification.expiresAt < new Date()) {
        await EmailVerification.deleteOne({ _id: verification._id })
        return res.status(400).json({ message: 'Token has expired' })
      }

      if (verification.isVerified) {
        return res.status(400).json({ message: 'Email already verified' })
      }

      // Mark as verified
      verification.isVerified = true
      verification.verifiedAt = new Date()
      await verification.save()

      // Update user
      await User.findByIdAndUpdate(verification.userId, {
        emailVerified: true,
        verifiedAt: new Date(),
      })

      res.json({ message: 'Email verified successfully' })
    } catch (error) {
      console.error('Verify email error:', error)
      res.status(500).json({ message: 'Failed to verify email', error: error.message })
    }
  }
)

/**
 * GET /api/verify-email/status
 * Get email verification status
 * @private
 */
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const pendingVerification = await EmailVerification.findOne({
      userId: req.user.id,
      isVerified: false,
    })

    res.json({
      emailVerified: user.emailVerified,
      email: user.email,
      pendingVerification: !!pendingVerification,
    })
  } catch (error) {
    console.error('Status check error:', error)
    res.status(500).json({ message: 'Failed to check status', error: error.message })
  }
})

module.exports = router
