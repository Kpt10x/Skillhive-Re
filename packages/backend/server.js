require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Body parser for JSON requests
const courseRoutes = require('./routes/courseRoutes');
const profileRoutes = require('./routes/profileRoutes');
const assesmentRoutes = require('./routes/assesmentRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

// Import routes
app.use('/api/courses', courseRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/assesments', assesmentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/submissions', submissionRoutes);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic route to check if the server is running
app.get('/', (req, res) => {
    res.send('Skillhive Backend API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});