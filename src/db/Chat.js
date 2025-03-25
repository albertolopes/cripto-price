const mongoose = require('mongoose');

const SERVICES = ['TELEGRAM', 'WHATSAPP', 'TWITTER'];

const chatSchema = new mongoose.Schema({
  chat_id: {
    type: Number,
    required: true,
    unique: true
  },
  service: {
    type: String,
    required: true,
    enum: SERVICES
  },
  username: {
    type: String,
    required: false
  },
  first_name: {
    type: String,
    required: false
  },
  last_name: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    required: false
  }
});

const Chat = mongoose.model(
    'Chat',
    chatSchema,
    process.env.NODE_ENV
);

module.exports = Chat;
