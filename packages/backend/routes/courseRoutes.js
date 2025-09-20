const express = require('express');
const Course = require('../models/Course'); // Adjust the path to your Course model
const router = express.Router();

// GET all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a specific course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findOne({ id: req.params.id });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new course
router.post('/', async (req, res) => {
    const course = new Course(req.body);
    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT (update) a course by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a course by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedCourse = await Course.findOneAndDelete({ id: req.params.id });
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;