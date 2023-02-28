const mongoose = require("mongoose");

const stoppageSchema = new mongoose.Schema({
    stoppageName: {
        type: String,
        unique: true,
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
  
  const stoppage = new mongoose.model("Stoppage", stoppageSchema);
  
  module.exports = stoppage;