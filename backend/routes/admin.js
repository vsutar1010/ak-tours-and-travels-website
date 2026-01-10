const express = require('express');
const router = express.Router();

// Admin login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Simple credential check (in production, use JWT and database)
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      res.status(200).json({
        success: true,
        message: 'Admin logged in successfully',
        token: 'admin-token-' + Date.now(), // Simple token (use JWT in production)
      });
    } else {
      res.status(401).json({ error: 'Invalid admin credentials' });
    }
  } catch (err) {
    console.error('Error in admin login:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
