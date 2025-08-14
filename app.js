const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();
app.use(cors());

// For all routes except webhook, parse JSON
app.use((req, res, next) => {
  if (req.originalUrl === '/api/pay/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth', authRoutes);
app.use('/api/pay', paymentRoutes);
app.use('/api/courses', courseRoutes);

module.exports = app;
