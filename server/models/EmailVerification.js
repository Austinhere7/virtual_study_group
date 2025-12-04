/**
 * Email Verification Model
 * Tracks email verification tokens and status
 */

const mongoose = require('mongoose')

const emailVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index for automatic cleanup
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('EmailVerification', emailVerificationSchema)
