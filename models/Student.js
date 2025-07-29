const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  track: String,
  amountPaid: Number,
  paymentReference: { type: String, required: true, unique: true },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);
