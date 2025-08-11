const Course = require('../models/Course')


exports.getCourses =  async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
}