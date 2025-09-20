const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    candidateId: { type: String, required: true },
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    answeredQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    submissionDate: { type: Date, required: true },
    status: { type: String, required: true }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;