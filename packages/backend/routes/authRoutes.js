const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile'); // Make sure the path to your Profile model is correct

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    // --- The Bouncer's Checklist ---

    // 1. Check if email, password, and role were provided
    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Please provide email, password, and role.' });
    }

    try {
        // 2. Look for the user on the guest list (database)
        const user = await Profile.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // User not found
        }

        // 3. Check if the password and role match
        if (user.password !== password || user.role !== role) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // Incorrect password or role
        }

        // 4. If everything checks out, let them in!
        // (We will add JWT token logic here later for better security)
        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during authentication.' });
    }
});

module.exports = router;