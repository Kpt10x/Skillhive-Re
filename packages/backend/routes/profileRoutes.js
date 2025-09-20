const express = require('express');
const Profile = require('../models/Profile'); // Adjust the path to your Profile model
const router = express.Router();

// GET all profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a specific profile by ID
router.get('/:id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ id: req.params.id });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new profile
router.post('/', async (req, res) => {
    const profile = new Profile(req.body);
    try {
        const newProfile = await profile.save();
        res.status(201).json(newProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT (update) a profile by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a profile by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProfile = await Profile.findOneAndDelete({ id: req.params.id });
        if (!deletedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;