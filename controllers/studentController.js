const Student = require('../models/Student')


exports.getStudent =  async (req, res) => {
  const students = await Student.find();
  res.json(students);
}