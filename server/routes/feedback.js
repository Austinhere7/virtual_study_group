const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")
const Feedback = require("../models/Feedback")
const User = require("../models/User")

// @route   GET api/feedback
// @desc    Get feedback (filtered by role)
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ msg: "User not found" })
    }

    let feedback

    if (user.role === "teacher") {
      // Teachers can see feedback about themselves
      feedback = await Feedback.find({ teacherId: user._id })
        .populate("studentId", "firstName lastName")
        .sort({ createdAt: -1 })

      // If feedback is anonymous, remove student information
      feedback = feedback.map((f) => {
        if (f.anonymous) {
          return {
            ...f._doc,
            studentId: { firstName: "Anonymous", lastName: "Student" },
          }
        }
        return f
      })
    } else {
      // Students can see feedback they've given
      feedback = await Feedback.find({ studentId: user._id })
        .populate("teacherId", "firstName lastName")
        .sort({ createdAt: -1 })
    }

    res.json(feedback)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/feedback
// @desc    Submit feedback
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("teacherId", "Teacher ID is required").not().isEmpty(),
      check("rating", "Rating is required").isInt({ min: 1, max: 5 }),
      check("content", "Content is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id)

      if (!user) {
        return res.status(404).json({ msg: "User not found" })
      }

      // Only students can submit feedback
      if (user.role !== "student") {
        return res.status(403).json({ msg: "Only students can submit feedback" })
      }

      const { teacherId, rating, content, anonymous } = req.body

      // Verify teacher exists
      const teacher = await User.findById(teacherId)

      if (!teacher || teacher.role !== "teacher") {
        return res.status(404).json({ msg: "Teacher not found" })
      }

      const newFeedback = new Feedback({
        teacherId,
        studentId: user._id,
        rating,
        content,
        anonymous: !!anonymous,
      })

      const feedback = await newFeedback.save()

      res.json(feedback)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  },
)

// @route   PUT api/feedback/:id/acknowledge
// @desc    Acknowledge feedback (for teachers)
// @access  Private
router.put("/:id/acknowledge", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ msg: "User not found" })
    }

    // Only teachers can acknowledge feedback
    if (user.role !== "teacher") {
      return res.status(403).json({ msg: "Only teachers can acknowledge feedback" })
    }

    const feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
      return res.status(404).json({ msg: "Feedback not found" })
    }

    // Check if this feedback is for this teacher
    if (feedback.teacherId.toString() !== user._id.toString()) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    feedback.status = "acknowledged"
    await feedback.save()

    res.json(feedback)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Feedback not found" })
    }
    res.status(500).send("Server error")
  }
})

module.exports = router

