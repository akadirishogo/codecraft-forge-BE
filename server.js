require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);


const PORT = process.env.PORT || 5000;

// Connect to MongoDB first
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');

  // Start server after DB connection
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1); // Exit with failure
});
