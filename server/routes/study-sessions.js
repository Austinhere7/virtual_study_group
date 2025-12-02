const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")
const StudySession = require("../models/StudySession")
const User = require("../models/User")

// @route   GET api/study-sessions
// @desc    Get study sessions
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { type, hostId, participantId } = req.query

    const query = {}

    if (hostId) {
      query.host = hostId
    }

    if (participantId) {
      query.participants = participantId
    }

    const sessions = await StudySession.find(query)
      .populate("host", "firstName lastName avatar")
      .populate("participants", "firstName lastName avatar")
      .sort({ date: 1, time: 1 })

    // Filter by upcoming or past if requested
    if (type === "upcoming" || type === "past") {
      const now = new Date()

      const filteredSessions = sessions.filter((session) => {
        const sessionDateTime = new Date(`${session.date}T${session.time}`)

        if (type === "upcoming") {
          return sessionDateTime > now
        } else {
          return sessionDateTime < now
        }
      })

      return res.json(filteredSessions)
    }

    res.json(sessions)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/study-sessions
// @desc    Create a study session
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
      check("subject", "Subject is required").not().isEmpty(),
      check("date", "Date is required").not().isEmpty(),
      check("time", "Time is required").not().isEmpty(),
      check("duration", "Duration is required").isInt({ min: 15 }),
      check("maxParticipants", "Maximum participants is required").isInt({ min: 2 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { title, description, subject, date, time, duration, maxParticipants } = req.body

      const newSession = new StudySession({
        title,
        description,
        subject,
        date,
        time,
        duration,
        host: req.user.id,
        maxParticipants,
        participants: [req.user.id], // Host is automatically a participant
      })

      const session = await newSession.save()

      // Populate host and participants
      await session.populate("host", "firstName lastName avatar").execPopulate()
      await session.populate("participants", "firstName lastName avatar").execPopulate()

      res.json(session)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  },
)

// @route   GET api/study-sessions/:id
// @desc    Get study session by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id)
      .populate("host", "firstName lastName avatar")
      .populate("participants", "firstName lastName avatar")

    if (!session) {
      return res.status(404).json({ msg: "Study session not found" })
    }

    res.json(session)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Study session not found" })
    }
    res.status(500).send("Server error")
  }
})

// @route   PUT api/study-sessions/:id/join
// @desc    Join a study session
// @access  Private
router.put("/:id/join", auth, async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ msg: "Study session not found" })
    }

    // Check if session is full
    if (session.participants.length >= session.maxParticipants) {
      return res.status(400).json({ msg: "Study session is full" })
    }

    // Check if user is already a participant
    if (session.participants.includes(req.user.id)) {
      return res.status(400).json({ msg: "Already a participant" })
    }

    // Add user to participants
    session.participants.push(req.user.id)
    await session.save()

    // Populate host and participants
    await session.populate("host", "firstName lastName avatar").execPopulate()
    await session.populate("participants", "firstName lastName avatar").execPopulate()

    res.json(session)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Study session not found" })
    }
    res.status(500).send("Server error")
  }
})

// @route   PUT api/study-sessions/:id/leave
// @desc    Leave a study session
// @access  Private
router.put("/:id/leave", auth, async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ msg: "Study session not found" })
    }

    // Check if user is the host
    if (session.host.toString() === req.user.id) {
      return res.status(400).json({ msg: "Host cannot leave the session" })
    }

    // Check if user is a participant
    if (!session.participants.includes(req.user.id)) {
      return res.status(400).json({ msg: "Not a participant" })
    }

    // Remove user from participants
    session.participants = session.participants.filter((participant) => participant.toString() !== req.user.id)

    await session.save()

    // Populate host and participants
    await session.populate("host", "firstName lastName avatar").execPopulate()
    await session.populate("participants", "firstName lastName avatar").execPopulate()

    res.json(session)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Study session not found" })
    }
    res.status(500).send("Server error")
  }
})

// @route   DELETE api/study-sessions/:id
// @desc    Delete a study session
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ msg: "Study session not found" })
    }

    // Check if user is the host
    if (session.host.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    await session.remove()

    res.json({ msg: "Study session removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Study session not found" })
    }
    res.status(500).send("Server error")
  }
})

module.exports = router

