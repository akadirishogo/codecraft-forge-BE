const express = require('express');
const studentController = require('../controllers/studentController');
const { adminAuth } = require('../middlewares/admin');

const router = express.Router();




router.post('/students', adminAuth, studentController.getStudent);

module.exports = router;