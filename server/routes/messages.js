/**
 * Direct Messaging Routes
 * Handles one-on-one messaging between users
 */

const express = require('express')
const auth = require('../middleware/auth')
const Message = require('../models/Message')
const User = require('../models/User')
const { body, validationResult } = require('express-validator')

const router = express.Router()

/**
 * GET /api/messages/:recipientId
 * Get conversation with a user
 * @private
 * @param {string} recipientId - Recipient user ID
 * @query {number} limit - Results limit (default 50)
 * @query {number} skip - Results offset (default 0)
 */
router.get('/:recipientId', auth, async (req, res) => {
  try {
    const { recipientId } = req.params
    const { limit = 50, skip = 0 } = req.query
    const userId = req.user.id

    // Check if recipient exists
    const recipient = await User.findById(recipientId)
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Get messages between users
    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId },
        { senderId: recipientId, recipientId: userId },
      ],
      deletedBy: { $nin: [userId] },
    })
      .populate('senderId', 'firstName lastName avatar')
      .populate('recipientId', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean()

    const total = await Message.countDocuments({
      $or: [
        { senderId: userId, recipientId },
        { senderId: recipientId, recipientId: userId },
      ],
      deletedBy: { $nin: [userId] },
    })

    // Mark as read
    await Message.updateMany(
      {
        senderId: recipientId,
        recipientId: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    )

    res.json({
      messages: messages.reverse(),
      recipient,
      total,
      hasMore: parseInt(skip) + parseInt(limit) < total,
    })
  } catch (error) {
    console.error('Fetch messages error:', error)
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message })
  }
})

/**
 * GET /api/messages
 * Get conversation list
 * @private
 * @query {number} limit - Results limit (default 20)
 * @query {number} skip - Results offset (default 0)
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id
    const { limit = 20, skip = 0 } = req.query

    // Get unique conversation partners
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { recipientId: userId }],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', userId] },
              '$recipientId',
              '$senderId',
            ],
          },
          lastMessage: { $last: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipientId', userId] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
      {
        $skip: parseInt(skip),
      },
      {
        $limit: parseInt(limit),
      },
    ])

    res.json({
      conversations: conversations.map((conv) => ({
        user: {
          _id: conv.user._id,
          firstName: conv.user.firstName,
          lastName: conv.user.lastName,
          avatar: conv.user.avatar,
          email: conv.user.email,
        },
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount,
      })),
    })
  } catch (error) {
    console.error('Fetch conversations error:', error)
    res.status(500).json({ message: 'Failed to fetch conversations', error: error.message })
  }
})

/**
 * POST /api/messages
 * Send a message
 * @private
 * @body {string} recipientId - Recipient user ID
 * @body {string} content - Message content
 * @body {array} attachments - File attachments (optional)
 */
router.post(
  '/',
  auth,
  [
    body('recipientId').notEmpty().withMessage('Recipient ID is required'),
    body('content')
      .notEmpty()
      .isLength({ min: 1, max: 5000 })
      .withMessage('Message must be 1-5000 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { recipientId, content, attachments = [] } = req.body
      const userId = req.user.id

      // Verify recipient exists
      const recipient = await User.findById(recipientId)
      if (!recipient) {
        return res.status(404).json({ message: 'Recipient not found' })
      }

      // Prevent self-messaging
      if (recipientId === userId) {
        return res.status(400).json({ message: 'Cannot message yourself' })
      }

      const message = new Message({
        senderId: userId,
        recipientId,
        content,
        attachments,
      })

      await message.save()
      await message.populate('senderId', 'firstName lastName avatar')
      await message.populate('recipientId', 'firstName lastName avatar')

      // Emit real-time notification if available
      if (global.io) {
        global.io.to(`user_${recipientId}`).emit('new_message', message)
      }

      res.status(201).json(message)
    } catch (error) {
      console.error('Send message error:', error)
      res.status(500).json({ message: 'Failed to send message', error: error.message })
    }
  }
)

/**
 * PATCH /api/messages/:id
 * Edit a message
 * @private
 * @param {string} id - Message ID
 * @body {string} content - Updated content
 */
router.patch(
  '/:id',
  auth,
  body('content')
    .notEmpty()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message must be 1-5000 characters'),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const message = await Message.findById(req.params.id)

      if (!message) {
        return res.status(404).json({ message: 'Message not found' })
      }

      if (message.senderId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Can only edit own messages' })
      }

      message.content = req.body.content
      message.editedAt = new Date()
      await message.save()

      res.json(message)
    } catch (error) {
      console.error('Edit message error:', error)
      res.status(500).json({ message: 'Failed to edit message', error: error.message })
    }
  }
)

/**
 * DELETE /api/messages/:id
 * Delete a message (soft delete for current user)
 * @private
 * @param {string} id - Message ID
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    if (
      message.senderId.toString() !== req.user.id &&
      message.recipientId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    // Soft delete by adding user to deletedBy
    if (!message.deletedBy.includes(req.user.id)) {
      message.deletedBy.push(req.user.id)
      await message.save()
    }

    res.json({ message: 'Message deleted' })
  } catch (error) {
    console.error('Delete message error:', error)
    res.status(500).json({ message: 'Failed to delete message', error: error.message })
  }
})

/**
 * PATCH /api/messages/:id/read
 * Mark message as read
 * @private
 * @param {string} id - Message ID
 */
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    )

    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    res.json(message)
  } catch (error) {
    console.error('Mark read error:', error)
    res.status(500).json({ message: 'Failed to mark as read', error: error.message })
  }
})

/**
 * POST /api/messages/:id/react
 * Add reaction to message
 * @private
 * @param {string} id - Message ID
 * @body {string} emoji - Emoji reaction
 */
router.post('/:id/react', auth, async (req, res) => {
  try {
    const { emoji } = req.body

    if (!emoji) {
      return res.status(400).json({ message: 'Emoji is required' })
    }

    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      (r) => r.userId.toString() === req.user.id && r.emoji === emoji
    )

    if (existingReaction) {
      // Remove reaction
      message.reactions = message.reactions.filter(
        (r) => !(r.userId.toString() === req.user.id && r.emoji === emoji)
      )
    } else {
      // Add reaction
      message.reactions.push({
        userId: req.user.id,
        emoji,
      })
    }

    await message.save()

    res.json(message)
  } catch (error) {
    console.error('React error:', error)
    res.status(500).json({ message: 'Failed to add reaction', error: error.message })
  }
})

module.exports = router
