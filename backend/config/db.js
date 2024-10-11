const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://maroof:maroof@127.0.0.1:27017/mernCodingChallenge?authSource=admin';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
