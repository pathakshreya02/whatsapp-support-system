const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sender: {
    type: String, // "user" or "admin"
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Message", messageSchema);