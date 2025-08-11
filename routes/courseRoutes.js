const express = require('express')
const { getCourses } = require('../controllers/courseController')

const router = express.Router();




router.post('/', getCourses);

module.exports = router;