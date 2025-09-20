const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;