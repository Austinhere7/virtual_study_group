/**
 * Study Groups Routes
 * Handles group management, membership, and operations
 */

const express = require('express')
const auth = require('../middleware/auth')
const StudyGroup = require('../models/StudyGroup')
const User = require('../models/User')
const { body, validationResult } = require('express-validator')

const router = express.Router()

/**
 * GET /api/study-groups
 * Get list of study groups with filters
 * @query {string} subject - Filter by subject
 * @query {string} grade - Filter by grade
 * @query {string} search - Search by name or tags
 * @query {number} limit - Results limit (default 20)
 * @query {number} skip - Results offset (default 0)
 */
router.get('/', async (req, res) => {
  try {
    const { subject, grade, search, limit = 20, skip = 0 } = req.query

    let filter = { isPublic: true }

    if (subject) filter.subject = subject
    if (grade) filter.grade = grade
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ]
    }

    const groups = await StudyGroup.find(filter)
      .populate('createdBy', 'firstName lastName avatar')
      .select('-joinRequests')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean()

    const total = await StudyGroup.countDocuments(filter)

    res.json({
      groups,
      total,
      hasMore: parseInt(skip) + parseInt(limit) < total,
    })
  } catch (error) {
    console.error('Fetch groups error:', error)
    res.status(500).json({ message: 'Failed to fetch groups', error: error.message })
  }
})

/**
 * GET /api/study-groups/:id
 * Get group details
 * @param {string} id - Group ID
 */
router.get('/:id', async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate('createdBy', 'firstName lastName avatar email')
      .populate('members', 'firstName lastName avatar')

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    res.json(group)
  } catch (error) {
    console.error('Fetch group error:', error)
    res.status(500).json({ message: 'Failed to fetch group', error: error.message })
  }
})

/**
 * POST /api/study-groups
 * Create a new study group
 * @private
 * @body {string} name - Group name
 * @body {string} description - Group description
 * @body {string} subject - Subject area
 * @body {string} grade - Grade/level
 * @body {boolean} isPublic - Public or private
 * @body {array} tags - Subject tags
 */
router.post(
  '/',
  auth,
  [
    body('name').notEmpty().isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
    body('description').notEmpty().isLength({ min: 10, max: 500 }).withMessage('Description must be 10-500 characters'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('grade').notEmpty().withMessage('Grade is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, description, subject, grade, isPublic = true, tags = [] } = req.body

      const group = new StudyGroup({
        name,
        description,
        subject,
        grade,
        isPublic,
        tags,
        createdBy: req.user.id,
        members: [req.user.id],
      })

      await group.save()
      await group.populate('createdBy', 'firstName lastName avatar')

      res.status(201).json(group)
    } catch (error) {
      console.error('Create group error:', error)
      res.status(500).json({ message: 'Failed to create group', error: error.message })
    }
  }
)

/**
 * PATCH /api/study-groups/:id
 * Update group details
 * @private
 * @param {string} id - Group ID
 */
router.patch('/:id', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only group creator can update' })
    }

    const { name, description, isPublic, tags, settings } = req.body

    if (name) group.name = name
    if (description) group.description = description
    if (isPublic !== undefined) group.isPublic = isPublic
    if (tags) group.tags = tags
    if (settings) group.settings = { ...group.settings, ...settings }

    await group.save()

    res.json(group)
  } catch (error) {
    console.error('Update group error:', error)
    res.status(500).json({ message: 'Failed to update group', error: error.message })
  }
})

/**
 * DELETE /api/study-groups/:id
 * Delete a study group
 * @private
 * @param {string} id - Group ID
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only group creator can delete' })
    }

    await StudyGroup.findByIdAndDelete(req.params.id)

    res.json({ message: 'Group deleted' })
  } catch (error) {
    console.error('Delete group error:', error)
    res.status(500).json({ message: 'Failed to delete group', error: error.message })
  }
})

/**
 * POST /api/study-groups/:id/join
 * Join a study group
 * @private
 * @param {string} id - Group ID
 */
router.post('/:id/join', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (!group.isPublic && group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Cannot join private group' })
    }

    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already a member' })
    }

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ message: 'Group is full' })
    }

    group.members.push(req.user.id)
    await group.save()

    res.json({ message: 'Joined group successfully' })
  } catch (error) {
    console.error('Join group error:', error)
    res.status(500).json({ message: 'Failed to join group', error: error.message })
  }
})

/**
 * POST /api/study-groups/:id/leave
 * Leave a study group
 * @private
 * @param {string} id - Group ID
 */
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (!group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Not a group member' })
    }

    if (group.createdBy.toString() === req.user.id) {
      return res.status(400).json({ message: 'Creator cannot leave group. Delete it instead.' })
    }

    group.members = group.members.filter((id) => id.toString() !== req.user.id)
    await group.save()

    res.json({ message: 'Left group successfully' })
  } catch (error) {
    console.error('Leave group error:', error)
    res.status(500).json({ message: 'Failed to leave group', error: error.message })
  }
})

/**
 * GET /api/study-groups/:id/members
 * Get group members
 * @param {string} id - Group ID
 */
router.get('/:id/members', async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate('members', 'firstName lastName avatar email')
      .select('members')

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    res.json({ members: group.members, count: group.members.length })
  } catch (error) {
    console.error('Fetch members error:', error)
    res.status(500).json({ message: 'Failed to fetch members', error: error.message })
  }
})

module.exports = router
