/**
 * User Profile Routes
 * Handles user profile management, avatar upload, and profile retrieval
 * 
 * @module routes/profile
 */

const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")
const Profile = require("../models/Profile")
const User = require("../models/User")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads/avatars")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif"]
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// @route   GET /api/profile/:userId
// @desc    Get user profile
// @access  Public
router.get("/:userId", async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.params.userId }).populate("userId", "firstName lastName email")

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" })
    }

    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id }).populate("userId", "firstName lastName email")

    if (!profile) {
      // Create profile if it doesn't exist
      profile = new Profile({ userId: req.user.id })
      await profile.save()
    }

    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  "/",
  [
    auth,
    check("bio", "Bio cannot exceed 500 characters").optional().isLength({ max: 500 }),
    check("subject", "Invalid subject").optional().isIn(["Mathematics", "Physics", "Chemistry", "Biology", "Literature", "History", "Other"]),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { bio, subject, grade, socialLinks, preferences } = req.body

      let profile = await Profile.findOne({ userId: req.user.id })

      if (profile) {
        // Update existing profile
        if (bio !== undefined) profile.bio = bio
        if (subject) profile.subject = subject
        if (grade) profile.grade = grade
        if (socialLinks) profile.socialLinks = { ...profile.socialLinks, ...socialLinks }
        if (preferences) profile.preferences = { ...profile.preferences, ...preferences }
        profile.updatedAt = Date.now()

        await profile.save()
        return res.json(profile)
      } else {
        // Create new profile
        profile = new Profile({
          userId: req.user.id,
          bio,
          subject,
          grade,
          socialLinks,
          preferences,
        })

        await profile.save()
        res.json(profile)
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

// @route   POST /api/profile/avatar
// @desc    Upload user avatar
// @access  Private
router.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    let profile = await Profile.findOne({ userId: req.user.id })

    if (!profile) {
      profile = new Profile({ userId: req.user.id })
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`
    profile.avatar = avatarPath
    profile.updatedAt = Date.now()

    await profile.save()
    res.json({ avatar: avatarPath, message: "Avatar uploaded successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
