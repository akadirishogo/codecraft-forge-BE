const mongoose = require('mongoose');
const slugify = require('slugify'); // we will install this

const courseSchema = new mongoose.Schema({
  track: { type: String, required: true },
  description: String,
  outline: [String],
  date: Date,
  price: Number,
  duration: Number,
  slug: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

// Automatically generate slug before saving
courseSchema.pre('save', function (next) {
  if (!this.isModified('track')) return next();
  this.slug = slugify(this.track, { lower: true });
  next();
});

module.exports = mongoose.model('Course', courseSchema);
