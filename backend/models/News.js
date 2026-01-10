const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['offer', 'update'],
      default: 'update', // 'offer' for special offers, 'update' for company updates
    },
    date: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String, // Store as base64 string or file path
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('News', newsSchema);
