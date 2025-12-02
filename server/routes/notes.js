const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")
const Note = require("../models/Note")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/notes"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  },
})

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /pdf|doc|docx|ppt|pptx|txt/
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime type
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb("Error: Documents Only!")
  }
}

// @route   GET api/notes
// @desc    Get all notes
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { subject, userId } = req.query
    const query = {}

    if (subject) {
      query.subject = subject
    }

    if (userId) {
      query.uploadedBy = userId
    }

    const notes = await Note.find(query).populate("uploadedBy", "firstName lastName").sort({ createdAt: -1 })

    res.json(notes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/notes
// @desc    Upload a note
// @access  Private
router.post(
  "/",
  [auth, upload.single("file")],
  [check("title", "Title is required").not().isEmpty(), check("subject", "Subject is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      if (!req.file) {
        return res.status(400).json({ msg: "Please upload a file" })
      }

      const { title, subject } = req.body
      const fileUrl = `/uploads/notes/${req.file.filename}`

      const newNote = new Note({
        title,
        subject,
        fileUrl,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        uploadedBy: req.user.id,
      })

      const note = await newNote.save()

      res.json(note)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  },
)

// @route   GET api/notes/:id
// @desc    Get note by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate("uploadedBy", "firstName lastName")

    if (!note) {
      return res.status(404).json({ msg: "Note not found" })
    }

    res.json(note)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Note not found" })
    }
    res.status(500).send("Server error")
  }
})

// @route   DELETE api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ msg: "Note not found" })
    }

    // Check user
    if (note.uploadedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }

    // Delete file from server
    const filePath = path.join(__dirname, "..", "..", note.fileUrl)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await note.remove()

    res.json({ msg: "Note removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Note not found" })
    }
    res.status(500).send("Server error")
  }
})

module.exports = router

