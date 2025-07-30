const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes')
const paymentRoutes = require('./routes/paymentRoutes')


const app = express();
app.use(cors());
app.use(express.json());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}




app.use('/api/auth', authRoutes);
app.use('/api/pay', paymentRoutes)

module.exports = app;
