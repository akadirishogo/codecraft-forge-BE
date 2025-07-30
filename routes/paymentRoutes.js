const express = require('express')
const { verifyPayment, makePayment } = require('../controllers/paymentController')

const router = express.Router();



router.post('/', makePayment)
router.get('/verifyPayment/:reference', verifyPayment);

module.exports = router;