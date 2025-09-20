const express = require('express');
const Enrollment = require('../models/Enrollment'); // Adjust the path to your Enrollment model
const router = express.Router();

// GET all enrollments
router.get('/', async (req, res) => {
    try {
        const enrollments = await Enrollment.find();
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a specific enrollment by ID
router.get('/:id', async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ id: req.params.id });
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new enrollment
router.post('/', async (req, res) => {
    const enrollment = new Enrollment(req.body);
    try {
        const newEnrollment = await enrollment.save();
        res.status(201).json(newEnrollment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT (update) an enrollment by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedEnrollment = await Enrollment.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedEnrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json(updatedEnrollment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE an enrollment by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedEnrollment = await Enrollment.findOneAndDelete({ id: req.params.id });
        if (!deletedEnrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.status(200).json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;