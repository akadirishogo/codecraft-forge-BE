const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  track: String,
  description: String,
  price: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
