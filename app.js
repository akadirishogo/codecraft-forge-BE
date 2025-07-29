const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const app = express();
app.use(cors());
app.use(express.json());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}




app.use('/api/auth', authRoutes);

module.exports = app;
