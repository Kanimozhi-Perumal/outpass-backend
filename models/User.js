const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'parent', 'admin'], required: true },
  faceId: { type: String, default: null }, // For FaceIO
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } // For parent linking to student
});

module.exports = mongoose.model('User', userSchema);