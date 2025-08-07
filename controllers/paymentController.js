const Student = require('../models/Student')
const axios = require('axios');
const sendConfirmationEmail = require('../utils/sendEmail');


exports.makePayment = async (req, res) => {
  const { name, email, track, amount } = req.body;
  const reference = `REF_${Date.now()}`; // optional: use Paystack-generated one

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // kobo
        callback_url: 'http://localhost:5173/payment-success',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Save student with reference
    await Student.create({
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1] || '',
      email,
      track,
      amountPaid: amount,
      paymentReference: response.data.data.reference,
      paymentStatus: 'pending',
    });

    res.json({ authorization_url: response.data.data.authorization_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment init failed' });
  }
};


exports.verifyPayment = async (req, res) => {
  const reference = req.params.reference;

  try {
    const verifyRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const status = verifyRes.data.data.status;

    if (status === 'success') {
      // Update payment status
      await Student.findOneAndUpdate(
        { paymentReference: reference },
        { paymentStatus: 'paid' }
      );

      const student = await Student.findOne({ paymentReference: reference });
      console.log(student)

       if (student) await sendConfirmationEmail(student.email, student.firstName, student.track)
      

      res.json({ verified: true, message: 'Payment successful!' });
    } else {
      res.status(400).json({ verified: false, message: 'Payment not completed.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
};
