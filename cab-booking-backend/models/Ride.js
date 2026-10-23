const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  rideType: { type: String, enum: ['Economy', 'Comfort', 'Luxury'], required: true },
  fare: { type: Number, required: true },
  status: { type: String, enum: ['Requested', 'Accepted', 'In Progress', 'Completed', 'Cancelled'], default: 'Requested' },
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);