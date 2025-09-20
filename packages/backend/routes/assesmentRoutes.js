const express = require('express');
const Assessment = require('../models/Assessment'); // Adjust the path to your Assessment model
const router = express.Router();

// GET all assessments
router.get('/', async (req, res) => {
    try {
        const assessments = await Assessment.find();
        res.status(200).json(assessments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a specific assessment by ID
router.get('/:id', async (req, res) => {
    try {
        const assessment = await Assessment.findOne({ id: req.params.id });
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.status(200).json(assessment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new assessment
router.post('/', async (req, res) => {
    const assessment = new Assessment(req.body);
    try {
        const newAssessment = await assessment.save();
        res.status(201).json(newAssessment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT (update) an assessment by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedAssessment = await Assessment.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedAssessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.status(200).json(updatedAssessment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE an assessment by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedAssessment = await Assessment.findOneAndDelete({ id: req.params.id });
        if (!deletedAssessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.status(200).json({ message: 'Assessment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;