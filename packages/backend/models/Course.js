const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    courseId: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    courseCategory: { type: String },
    courseDurationMonths: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    instructor: { type: String },
    assessmentDate: { type: Date },
    openForEnrollment: { type: Boolean },
    content: { type: String },
    enableAssessment: { type: Boolean },
    noOfEnrollments: { type: Number },
    seatsLeft: { type: Number }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;