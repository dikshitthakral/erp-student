const { string } = require("joi");
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
  });
  
  const notification = new mongoose.model("Notification", notificationSchema);
  
  module.exports = notification;