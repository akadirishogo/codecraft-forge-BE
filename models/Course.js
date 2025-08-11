const mongoose = require('mongoose');
const slugify = require('slugify'); // we will install this

const courseSchema = new mongoose.Schema({
  track: String,
  description: String,
  price: Number,
  slug: String,
  createdAt: Date,
  date: String,
  duration: Number,
  curriculum: String,
  naira: Number,
  dollar: Number,
  outline: [String]
});

// Automatically generate slug before saving
// courseSchema.pre('save', function (next) {
//   if (!this.isModified('track')) return next();
//   this.slug = slugify(this.track, { lower: true });
//   next();
// });

module.exports = mongoose.model('Course', courseSchema);
