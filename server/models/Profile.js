/**
 * User Profile Model
 * Extended user profile information and settings
 * 
 * @module models/Profile
 */

const mongoose = require("mongoose")

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    maxlength: 500,
    default: "",
  },
  avatar: {
    type: String,
    default: "/placeholder-user.jpg",
  },
  subject: {
    type: String,
    enum: ["Mathematics", "Physics", "Chemistry", "Biology", "Literature", "History", "Other"],
    default: "Other",
  },
  grade: {
    type: String,
    enum: ["9", "10", "11", "12", "Undergraduate", "Postgraduate"],
    default: "Undergraduate",
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  socialLinks: {
    twitter: String,
    linkedin: String,
    github: String,
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    studyReminders: {
      type: Boolean,
      default: true,
    },
    newAnswerNotifications: {
      type: Boolean,
      default: true,
    },
  },
  stats: {
    notesUploaded: {
      type: Number,
      default: 0,
    },
    questionsAsked: {
      type: Number,
      default: 0,
    },
    answersGiven: {
      type: Number,
      default: 0,
    },
    sessionsHosted: {
      type: Number,
      default: 0,
    },
    sessionsAttended: {
      type: Number,
      default: 0,
    },
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Profile", ProfileSchema)
