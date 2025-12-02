const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")
const User = require("../models/User")
const auth = require("../middleware/auth")

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
    check("role", "Role is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { firstName, lastName, email, password, role, subject, grade } = req.body

    try {
      // Check if user exists
      let user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({ msg: "User already exists" })
      }

      // Create new user
      user = new User({
        firstName,
        lastName,
        email,
        password,
        role,
        subject,
        grade,
      })

      // Save user to database
      await user.save()

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
        },
      }

      // Sign token
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5 days" }, (err, token) => {
        if (err) throw err
        res.json({ token })
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  },
)

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [check("email", "Please include a valid email").isEmail(), check("password", "Password is required").exists()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      // Check if user exists
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" })
      }

      // Check password
      const isMatch = await user.comparePassword(password)

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" })
      }

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
        },
      }

      // Sign token
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5 days" }, (err, token) => {
        if (err) throw err
        res.json({ token })
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  },
)

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    // Get user data without password
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router

