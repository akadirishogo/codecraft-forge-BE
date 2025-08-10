const express = require('express')
const { verifyPayment, makePayment, handleWebhook } = require('../controllers/paymentController')

const router = express.Router();




router.post('/', makePayment)
router.get('/verifyPayment/:reference', verifyPayment);

// Webhook route (must use raw body parser for signature check)
router.post('/webhook',
  express.raw({ type: 'application/json' }), handleWebhook
);

module.exports = router;