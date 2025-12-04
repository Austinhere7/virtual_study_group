/**
 * Study Group Model
 * Manages group-based study sessions and collaboration
 */

const mongoose = require('mongoose')

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    subject: {
      type: String,
      enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Literature', 'History', 'Other'],
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maxMembers: {
      type: Number,
      default: 50,
      min: 2,
      max: 100,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
    },
    tags: [String],
    settings: {
      allowChat: {
        type: Boolean,
        default: true,
      },
      allowResources: {
        type: Boolean,
        default: true,
      },
      requireApproval: {
        type: Boolean,
        default: false,
      },
      allowScheduling: {
        type: Boolean,
        default: true,
      },
    },
    stats: {
      totalSessions: {
        type: Number,
        default: 0,
      },
      totalMessages: {
        type: Number,
        default: 0,
      },
      totalResources: {
        type: Number,
        default: 0,
      },
    },
    joinRequests: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
)

// Indexes
studyGroupSchema.index({ createdBy: 1 })
studyGroupSchema.index({ subject: 1, grade: 1 })
studyGroupSchema.index({ members: 1 })
studyGroupSchema.index({ tags: 1 })
studyGroupSchema.index({ isPublic: 1 })

module.exports = mongoose.model('StudyGroup', studyGroupSchema)
