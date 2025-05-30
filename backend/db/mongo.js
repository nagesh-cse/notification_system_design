const mongoose = require('mongoose');
require('dotenv').config();

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      bufferTimeoutMS: 30000,
    });
    console.log('Connected to MongoDB with Mongoose');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

const NotificationSchema = new mongoose.Schema({
  user_id: String,
  message: String,
  post_id: String,
  timestamp: Number,
  read: Boolean
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = { connectMongo, Notification };