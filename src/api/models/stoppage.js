const mongoose = require("mongoose");

const stoppageSchema = new mongoose.Schema({
    stoppageId: {
        type: String,
        unique: true,
        required: true
    },
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