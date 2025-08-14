const crypto = require('crypto');
const Student = require('../models/Student');
const axios = require('axios');
const sendConfirmationEmail = require('../utils/sendEmail');

/**
 * Shared function to confirm payment & update DB
 */
async function confirmAndProcessPayment(reference) {
  const verifyRes = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const status = verifyRes.data.data.status;

  if (status === 'success') {
    const student = await Student.findOneAndUpdate(
      { paymentReference: reference },
      { paymentStatus: 'paid' },
      { new: true }
    );

    if (student) {
      await sendConfirmationEmail(student.email, student.firstName, student.track);
    }
    return true;
  }

  return false;
}

/**
 * Initializes payment
 */
exports.makePayment = async (req, res) => {
  const { name, email, track, amount } = req.body;

  try {
    // Step 1: Initialize payment with Paystack
    const paystackRes = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Paystack expects kobo
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reference = paystackRes.data?.data?.reference;
    const authorizationUrl = paystackRes.data?.data?.authorization_url;

    if (!authorizationUrl) {
      return res.status(500).json({ error: 'Payment initialization failed at Paystack' });
    }

    try {
      await Student.create({
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        email,
        track,
        amountPaid: amount,
        paymentReference: reference,
        paymentStatus: 'pending',
      });
    } catch (dbErr) {
      console.error('DB Error:', dbErr);
      return res.status(500).json({ error: 'Payment initialized but could not save student record' });
    }

    res.json({ authorization_url: authorizationUrl });

  } catch (err) {
    console.error('Paystack Init Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Could not start payment process' });
  }
};


/**
 * Manual verification (backup + instant feedback)
 */
exports.verifyPayment = async (req, res) => {
  try {
    const success = await confirmAndProcessPayment(req.params.reference);
    if (success) {
      res.json({ verified: true, message: 'Payment successful!' });
    } else {
      res.status(400).json({ verified: false, message: 'Payment not completed.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
};

/**
 * Webhook handler (primary payment confirmation)
 */
exports.handleWebhook = async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const hash = crypto
    .createHmac('sha512', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;

  if (event.event === 'charge.success') {
    const reference = event.data.reference;
    try {
      await confirmAndProcessPayment(reference);
    } catch (err) {
      console.error('Error processing webhook:', err);
    }
  }

  res.sendStatus(200);
};
