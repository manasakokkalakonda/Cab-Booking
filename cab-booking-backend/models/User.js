const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, enum: ['rider', 'driver'], default: 'rider' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);