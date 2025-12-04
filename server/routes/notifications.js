/**
 * Notifications Routes
 * Handles notification management and delivery
 */

const express = require('express')
const auth = require('../middleware/auth')
const Notification = require('../models/Notification')
const { body, validationResult } = require('express-validator')

const router = express.Router()

/**
 * GET /api/notifications
 * Get user notifications (unread first)
 * @private
 * @query {number} limit - Max number of notifications (default 20)
 * @query {number} skip - Number of notifications to skip (default 0)
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id
    const limit = parseInt(req.query.limit) || 20
    const skip = parseInt(req.query.skip) || 0

    const notifications = await Notification.find({ userId })
      .populate('fromUser', 'firstName lastName avatar')
      .sort({ isRead: 1, createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await Notification.countDocuments({ userId })
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    })

    res.json({
      notifications,
      total,
      unreadCount,
      hasMore: skip + limit < total,
    })
  } catch (error) {
    console.error('Fetch notifications error:', error)
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message })
  }
})

/**
 * GET /api/notifications/unread-count
 * Get count of unread notifications
 * @private
 */
router.get('/unread-count', auth, async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    })

    res.json({ unreadCount })
  } catch (error) {
    console.error('Unread count error:', error)
    res.status(500).json({ message: 'Failed to fetch unread count', error: error.message })
  }
})

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 * @private
 * @param {string} id - Notification ID
 */
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true, readAt: new Date() },
      { new: true }
    )

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    res.json(notification)
  } catch (error) {
    console.error('Mark read error:', error)
    res.status(500).json({ message: 'Failed to mark notification', error: error.message })
  }
})

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 * @private
 */
router.patch('/read-all', auth, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    )

    res.json({ modifiedCount: result.modifiedCount })
  } catch (error) {
    console.error('Mark all read error:', error)
    res.status(500).json({ message: 'Failed to mark all notifications', error: error.message })
  }
})

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 * @private
 * @param {string} id - Notification ID
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    res.json({ message: 'Notification deleted' })
  } catch (error) {
    console.error('Delete notification error:', error)
    res.status(500).json({ message: 'Failed to delete notification', error: error.message })
  }
})

/**
 * DELETE /api/notifications
 * Delete all notifications
 * @private
 * @query {string} read - If "true", only delete read notifications
 */
router.delete('/', auth, async (req, res) => {
  try {
    const filter = { userId: req.user.id }
    if (req.query.read === 'true') {
      filter.isRead = true
    }

    const result = await Notification.deleteMany(filter)

    res.json({ deletedCount: result.deletedCount })
  } catch (error) {
    console.error('Delete all notifications error:', error)
    res.status(500).json({ message: 'Failed to delete notifications', error: error.message })
  }
})

/**
 * Create notification (internal use)
 * Used by other routes to create notifications
 */
async function createNotification(userId, data) {
  try {
    const notification = new Notification({
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      relatedId: data.relatedId,
      relatedModel: data.relatedModel,
      fromUser: data.fromUser,
    })
    await notification.save()

    // Emit to socket.io if available
    if (global.io) {
      global.io.to(`user_${userId}`).emit('new_notification', notification)
    }

    return notification
  } catch (error) {
    console.error('Create notification error:', error)
  }
}

module.exports = router
module.exports.createNotification = createNotification
