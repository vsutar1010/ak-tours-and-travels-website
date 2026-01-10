const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    media: {
      type: String, // Store as base64 string or file path
      default: null,
    },
    mediaType: {
      type: String, // 'image' or 'video'
      default: null,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: String,
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
