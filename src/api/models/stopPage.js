const mongoose = require("mongoose");

const stopPageSchema = new mongoose.Schema({
    stopPage: {
        type: String,
        required: true
    },
    stopTime: {
        type: String,
        required: true
    },
    routeFare: {
        type: Number,
        required: true
    }
  });
  
  const stopPage = new mongoose.model("stopPage", stopPageSchema);
  
  module.exports = stopPage;