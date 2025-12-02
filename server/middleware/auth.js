const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Middleware to authenticate JWT token
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("x-auth-token")

    // Check if no token
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Add user from payload
    req.user = await User.findById(decoded.user.id).select("-password")

    next()
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" })
  }
}

module.exports = auth

