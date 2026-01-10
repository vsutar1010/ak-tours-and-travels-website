import mongoose from 'mongoose';

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
      default: 'update',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model('News', newsSchema);
