const express = require('express');
const Submission = require('../models/Submission'); // Adjust the path to your model
const router = express.Router();

// GET all submissions
router.get('/', async (req, res) => {
    try {
        const submissions = await Submission.find();
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a specific submission by ID
router.get('/:id', async (req, res) => {
    try {
        const submission = await Submission.findOne({ id: req.params.id });
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(200).json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new submission
router.post('/', async (req, res) => {
    const submission = new Submission(req.body);
    try {
        const newSubmission = await submission.save();
        res.status(201).json(newSubmission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT (update) a submission by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedSubmission = await Submission.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedSubmission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(200).json(updatedSubmission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a submission by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedSubmission = await Submission.findOneAndDelete({ id: req.params.id });
        if (!deletedSubmission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(200).json({ message: 'Submission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;