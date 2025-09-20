const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true }
});

const assessmentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    assessmentDate: { type: Date, required: true },
    questions: { type: [questionSchema], required: true }
}, { timestamps: true });

const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;