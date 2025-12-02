const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")
const Question = require("../models/Question")
const Answer = require("../models/Answer")
const User = require("../models/User")

// @route   GET api/questions
// @desc    Get all questions
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { subject, userId, solved } = req.query
    const query = {}

    if (subject) {
      query.subject = subject
    }

    if (userId) {
      query.author = userId
    }

    if (solved !== undefined) {
      query.solved = solved === "true"
    }

    const questions = await Question.find(query).populate("author", "firstName lastName avatar").sort({ createdAt: -1 })

    // Get answer count for each question
    const questionsWithCounts = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await Answer.countDocuments({ questionId: question._id })
        return {
          ...question._doc,
          answers: answerCount,
        }
      }),
    )

    res.json(questionsWithCounts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/questions
// @desc    Create a question
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("content", "Content is required").not().isEmpty(),
      check("subject", "Subject is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { title, content, subject } = req.body

      const newQuestion = new Question({
        title,
        content,
        subject,
        author: req.user.id,
      })

      const question = await newQuestion.save()

      // Populate author details
      await question.populate("author", "firstName lastName avatar").execPopulate()

      res.json(question)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  },
)

// @route   GET api/questions/:id
// @desc    Get question by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("author", "firstName lastName avatar")

    if (!question) {
      return res.status(404).json({ msg: "Question not found" })
    }

    // Get answers for this question
    const answers = await Answer.find({ questionId: question._id })
      .populate("author", "firstName lastName avatar role")
      .sort({ accepted: -1, votes: -1, createdAt: -1 })

    res.json({ question, answers })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Question not found" })
    }
    res.status(500).send("Server error")
  }
})

// @route   PUT api/questions/:id
// @desc    Update a question
// @access  Private
router.put(
  "/:id",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("content", "Content is required").not().isEmpty(),
      check("subject", "Subject is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const question = await Question.findById(req.params.id)

      if (!question) {
        return res.status(404).json({ msg: "Question not found" })
      }

      // Check user
      if (question.author.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" })
      }

      const { title, content, subject } = req.body

      question.title = title
      question.content = content
      question.subject = subject

      await question.save()

      res.json(question)
    } catch (err) {
      console.error(err.message)
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Question not found" })
      }
      res.status(500).send("Server error")
    }
  },
)

// @route   DELETE api/questions/:id
// @desc    Delete a question
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)

    if (!question) {
      return res.status(404).json({ msg: "Question not found" })
    }

    // Check user
    if (question.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }

    // Delete all answers to this question
    await Answer.deleteMany({ questionId: question._id })

    // Delete the question
    await question.remove()

    res.json({ msg: "Question removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Question not found" })
    }
    res.status(500).send("Server error")
  }
})

// @route   PUT api/questions/:id/vote
// @desc    Upvote a question
// @access  Private
router.put("/:id/vote", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)

    if (!question) {
      return res.status(404).json({ msg: "Question not found" })
    }

    // Increment votes
    question.votes += 1

    await question.save()

    res.json(question)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Question not found" })
    }
    res.status(500).send("Server error")
  }
})

// @route   POST api/questions/:id/answers
// @desc    Add an answer to a question
// @access  Private
router.post("/:id/answers", [auth, [check("content", "Content is required").not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const question = await Question.findById(req.params.id)

    if (!question) {
      return res.status(404).json({ msg: "Question not found" })
    }

    const { content } = req.body

    const newAnswer = new Answer({
      questionId: question._id,
      content,
      author: req.user.id,
    })

    const answer = await newAnswer.save()

    // Populate author details
    await answer.populate("author", "firstName lastName avatar role").execPopulate()

    res.json(answer)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Question not found" })
    }
    res.status(500).send("Server error")
  }
})

// @route   PUT api/questions/:id/answers/:answerId/accept
// @desc    Accept an answer
// @access  Private
router.put("/:id/answers/:answerId/accept", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)

    if (!question) {
      return res.status(404).json({ msg: "Question not found" })
    }

    // Check if user is the question author
    if (question.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }

    // Find the answer
    const answer = await Answer.findById(req.params.answerId)

    if (!answer) {
      return res.status(404).json({ msg: "Answer not found" })
    }

    // Make sure the answer belongs to this question
    if (answer.questionId.toString() !== question._id.toString()) {
      return res.status(400).json({ msg: "Answer does not belong to this question" })
    }

    // Reset all accepted answers for this question
    await Answer.updateMany({ questionId: question._id }, { $set: { accepted: false } })

    // Accept this answer
    answer.accepted = true
    await answer.save()

    // Mark question as solved
    question.solved = true
    await question.save()

    res.json({ answer, question })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Resource not found" })
    }
    res.status(500).send("Server error")
  }
})

// @route   PUT api/questions/:id/answers/:answerId/vote
// @desc    Upvote an answer
// @access  Private
router.put("/:id/answers/:answerId/vote", auth, async (req, res) => {
  try {
    // Find the answer
    const answer = await Answer.findById(req.params.answerId)

    if (!answer) {
      return res.status(404).json({ msg: "Answer not found" })
    }

    // Increment votes
    answer.votes += 1

    await answer.save()

    res.json(answer)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Answer not found" })
    }
    res.status(500).send("Server error")
  }
})

module.exports = router

