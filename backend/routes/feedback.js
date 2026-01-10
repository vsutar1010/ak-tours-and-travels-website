const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');

// Middleware to check MongoDB connection
const checkDBConnection = (req, res, next) => {
  const readyState = mongoose.connection.readyState;
  if (readyState !== 1) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    console.error('❌ MongoDB not connected. State:', readyState, `(${states[readyState] || 'unknown'})`);
    return res.status(503).json({ 
      error: 'Database connection unavailable. Please try again.',
      details: `MongoDB connection state: ${states[readyState] || readyState}. Connection is not established.`,
      readyState: readyState
    });
  }
  next();
};

// Apply connection check to all routes
router.use(checkDBConnection);

// Submit feedback (users submit feedbacks - not approved by default)
router.post('/submit', async (req, res) => {
  try {
    const { name, rating, message, tags, media, mediaType } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({ error: 'Name, rating, and message are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const feedback = new Feedback({
      name: name.trim(),
      rating: Number(rating),
      message: message.trim(),
      tags: tags || [],
      media: media || null,
      mediaType: mediaType || null,
      approved: false,
    });

    await feedback.save();
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully and is pending admin approval',
      feedback,
    });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Add new feedback manually (admin only - automatically approved)
router.post('/add', async (req, res) => {
  try {
    const { name, rating, message, tags, media, mediaType } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({ error: 'Name, rating, and message are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const feedback = new Feedback({
      name: name.trim(),
      rating: Number(rating),
      message: message.trim(),
      tags: tags || [],
      media: media || null,
      mediaType: mediaType || null,
      approved: true, // Automatically approved when added by admin
      approvedBy: 'admin',
      approvedAt: new Date(),
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback added successfully',
      feedback,
    });
  } catch (err) {
    console.error('Error adding feedback:', err);
    res.status(500).json({ error: 'Failed to add feedback' });
  }
});

// Get all approved feedbacks (for public display on Feedback.jsx)
router.get('/approved', async (req, res) => {
  try {
    const approvedFeedbacks = await Feedback.find({ approved: true })
      .sort({ approvedAt: -1 })
      .select('-approvedBy -__v');

    res.status(200).json({
      success: true,
      data: approvedFeedbacks,
    });
  } catch (err) {
    console.error('Error fetching approved feedbacks:', err);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Get all pending feedbacks (for admin dashboard)
router.get('/pending', async (req, res) => {
  try {
    const pendingFeedbacks = await Feedback.find({ approved: false })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingFeedbacks,
    });
  } catch (err) {
    console.error('Error fetching pending feedbacks:', err);
    res.status(500).json({ error: 'Failed to fetch pending feedbacks' });
  }
});

// Approve feedback (admin only)
router.put('/approve/:id', async (req, res) => {
  try {
    const { feedbackId } = req.body;
    const id = feedbackId || req.params.id;

    if (!id) {
      return res.status(400).json({ error: 'Feedback ID is required' });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      {
        approved: true,
        approvedBy: 'admin',
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback approved successfully',
      feedback,
    });
  } catch (err) {
    console.error('Error approving feedback:', err);
    res.status(500).json({ error: 'Failed to approve feedback' });
  }
});

// Reject feedback (admin deletes it)
router.delete('/reject/:id', async (req, res) => {
  try {
    const { feedbackId } = req.body;
    const id = feedbackId || req.params.id;

    if (!id) {
      return res.status(400).json({ error: 'Feedback ID is required' });
    }

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback rejected and deleted',
    });
  } catch (err) {
    console.error('Error rejecting feedback:', err);
    res.status(500).json({ error: 'Failed to reject feedback' });
  }
});

// Delete approved feedback (admin can delete published reviews)
router.delete('/delete/:id', async (req, res) => {
  try {
    const { feedbackId } = req.body;
    const id = feedbackId || req.params.id;

    if (!id) {
      return res.status(400).json({ error: 'Feedback ID is required' });
    }

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting feedback:', err);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

module.exports = router;
