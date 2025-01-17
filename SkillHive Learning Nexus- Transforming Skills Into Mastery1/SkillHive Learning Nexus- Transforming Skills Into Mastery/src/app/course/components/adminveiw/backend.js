const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Path to the courses JSON file
const COURSES_FILE = path.join(__dirname, '../../../../../JSON Server/course.json');

// Helper function to read courses from the JSON file
const readCourses = () => {
  try {
    const data = fs.readFileSync(COURSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading courses file:', error);
    return [];
  }
};

// Helper function to write courses to the JSON file
const writeCourses = (courses) => {
  try {
    fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
  } catch (error) {
    console.error('Error writing to courses file:', error);
  }
};

// Routes

// Get all courses
app.get('/courses', (req, res) => {
  const courses = readCourses();
  res.json(courses);
});

// Create a new course
app.post('/courses', (req, res) => {
  const courses = readCourses();
  const newCourse = req.body;

  if (!newCourse.name || !newCourse.status || !newCourse.description) {
    return res.status(400).json({ error: 'Name, status, and description are required.' });
  }

  newCourse.id = courses.length ? courses[courses.length - 1].id + 1 : 1; // Generate new ID
  courses.push(newCourse);
  writeCourses(courses);

  res.status(201).json({ message: 'Course created successfully', course: newCourse });
});

// Edit an existing course
app.put('/courses/:id', (req, res) => {
  const courses = readCourses();
  const courseId = parseInt(req.params.id, 10);
  const updatedCourse = req.body;

  const courseIndex = courses.findIndex((course) => course.id === courseId);
  if (courseIndex === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }

  courses[courseIndex] = { ...courses[courseIndex], ...updatedCourse }; // Update course
  writeCourses(courses);

  res.json({ message: 'Course updated successfully', course: courses[courseIndex] });
});

// Delete a course
app.delete('/courses/:id', (req, res) => {
  const courses = readCourses();
  const courseId = parseInt(req.params.id, 10);

  const filteredCourses = courses.filter((course) => course.id !== courseId);
  if (filteredCourses.length === courses.length) {
    return res.status(404).json({ error: 'Course not found' });
  }

  writeCourses(filteredCourses);
  res.json({ message: 'Course deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
