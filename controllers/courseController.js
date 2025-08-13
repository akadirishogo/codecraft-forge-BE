const Course = require('../models/Course')


exports.getCourses =  async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
}

exports.getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json(course);
}