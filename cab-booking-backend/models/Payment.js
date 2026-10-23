const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Successful', 'Failed'], default: 'Pending' },
  stripePaymentIntentId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);