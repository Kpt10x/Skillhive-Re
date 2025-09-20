const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    candidateId: { type: String, required: true },
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    courseCategory: { type: String, required: true },
    instructor: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
}, { timestamps: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;