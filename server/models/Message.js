/**
 * Message Model
 * Handles direct messages between users
 */

const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    attachments: [
      {
        url: String,
        fileName: String,
        fileType: String,
        fileSize: Number,
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    deletedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reactions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        emoji: String,
      },
    ],
  },
  { timestamps: true }
)

// Indexes for efficient queries
messageSchema.index({ senderId: 1, recipientId: 1, createdAt: -1 })
messageSchema.index({ recipientId: 1, isRead: 1 })
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }) // 90 days TTL

module.exports = mongoose.model('Message', messageSchema)
