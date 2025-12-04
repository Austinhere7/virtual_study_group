/**
 * Dashboard Routes
 * Handles dashboard stats and activity endpoints
 */

const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/User')
const Profile = require('../models/Profile')
const Note = require('../models/Note')
const Question = require('../models/Question')
const StudySession = require('../models/StudySession')
const Feedback = require('../models/Feedback')

const router = express.Router()

/**
 * GET /api/dashboard/stats
 * Get user statistics for dashboard
 * @private
 */
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id

    // Fetch profile for stats
    const profile = await Profile.findOne({ userId })

    // Count documents created by user
    const notesCount = await Note.countDocuments({ uploadedBy: userId })
    const questionsCount = await Question.countDocuments({ askedBy: userId })
    const answersCount = await Question.countDocuments({
      'answers.answeredBy': userId,
    })

    // Count study sessions
    const sessionsHosted = await StudySession.countDocuments({ hostId: userId })
    const sessionsAttended = await StudySession.countDocuments({
      participants: userId,
    })

    // Weekly stats
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const weeklyNotesUploaded = await Note.countDocuments({
      uploadedBy: userId,
      createdAt: { $gte: oneWeekAgo },
    })

    const weeklyQuestionsAsked = await Question.countDocuments({
      askedBy: userId,
      createdAt: { $gte: oneWeekAgo },
    })

    const weeklySessionsAttended = await StudySession.countDocuments({
      participants: userId,
      createdAt: { $gte: oneWeekAgo },
    })

    // Group stats
    const groupsJoined = 0 // Will be updated when StudyGroup model is created

    res.json({
      notesUploaded: notesCount,
      questionsAsked: questionsCount,
      answersGiven: answersCount,
      sessionsHosted,
      sessionsAttended,
      groupsJoined,
      weeklyNotesUploaded,
      weeklyQuestionsAsked,
      weeklySessionsAttended,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message })
  }
})

/**
 * GET /api/dashboard/activity
 * Get recent activity for dashboard
 * @private
 */
router.get('/activity', auth, async (req, res) => {
  try {
    const userId = req.user.id
    const limit = 10

    // Get recent notes
    const notes = await Note.find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // Get recent questions
    const questions = await Question.find({ askedBy: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // Get recent answers
    const answers = await Question.find({
      'answers.answeredBy': userId,
    })
      .sort({ 'answers.createdAt': -1 })
      .limit(limit)
      .lean()

    // Get recent sessions attended
    const sessions = await StudySession.find({ participants: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    // Combine and sort by date
    const activity = [
      ...notes.map((note) => ({
        type: 'note',
        title: note.title,
        description: `Uploaded a note in ${note.subject}`,
        timestamp: formatTime(note.createdAt),
        date: note.createdAt,
      })),
      ...questions.map((question) => ({
        type: 'question',
        title: question.title,
        description: `Asked a question in ${question.subject}`,
        timestamp: formatTime(question.createdAt),
        date: question.createdAt,
      })),
      ...answers.map((question) => {
        const answer = question.answers[question.answers.length - 1]
        return {
          type: 'answer',
          title: 'Answered a question',
          description: `Answered "${question.title}"`,
          timestamp: formatTime(answer.createdAt),
          date: answer.createdAt,
        }
      }),
      ...sessions.map((session) => ({
        type: 'session',
        title: session.title,
        description: `Attended a study session`,
        timestamp: formatTime(session.createdAt),
        date: session.createdAt,
      })),
    ]

    // Sort by date and limit
    activity.sort((a, b) => b.date - a.date)
    const sortedActivity = activity.slice(0, limit)

    res.json(sortedActivity)
  } catch (error) {
    console.error('Dashboard activity error:', error)
    res.status(500).json({ message: 'Failed to fetch activity', error: error.message })
  }
})

/**
 * Helper function to format time
 */
function formatTime(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return new Date(date).toLocaleDateString()
}

module.exports = router
