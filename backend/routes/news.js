const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const News = require('../models/News');

// Middleware to check MongoDB connection
const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.error('MongoDB not connected. State:', mongoose.connection.readyState);
    return res.status(503).json({ 
      error: 'Database connection unavailable. Please try again.',
      details: 'MongoDB connection is not established'
    });
  }
  next();
};

// Apply connection check to all routes
router.use(checkDBConnection);

// Get all news (for display on LatestNews page)
router.get('/all', async (req, res) => {
  try {
    const news = await News.find()
      .sort({ date: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get news by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!['offer', 'update'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const news = await News.find({ category })
      .sort({ date: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (err) {
    console.error('Error fetching news by category:', err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Add new news (admin only)
router.post('/add', async (req, res) => {
  try {
    const { title, content, category, image } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }

    if (!['offer', 'update'].includes(category)) {
      return res.status(400).json({ error: 'Category must be "offer" or "update"' });
    }

    const news = new News({
      title: title.trim(),
      content: content.trim(),
      category,
      image: image || null,
      date: new Date(),
    });

    await news.save();

    res.status(201).json({
      success: true,
      message: 'News added successfully',
      news,
    });
  } catch (err) {
    console.error('Error adding news:', err);
    res.status(500).json({ error: 'Failed to add news' });
  }
});

// Update news (admin only)
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, image } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }

    if (!['offer', 'update'].includes(category)) {
      return res.status(400).json({ error: 'Category must be "offer" or "update"' });
    }

    const news = await News.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        content: content.trim(),
        category,
        image: image || null,
      },
      { new: true }
    );

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.status(200).json({
      success: true,
      message: 'News updated successfully',
      news,
    });
  } catch (err) {
    console.error('Error updating news:', err);
    res.status(500).json({ error: 'Failed to update news' });
  }
});

// Delete news (admin only)
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.status(200).json({
      success: true,
      message: 'News deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting news:', err);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

module.exports = router;
