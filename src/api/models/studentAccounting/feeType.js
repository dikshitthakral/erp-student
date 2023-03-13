const mongoose = require("mongoose");

const feeTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: false
    }
  });
  
  const feeType = new mongoose.model("FeeType", feeTypeSchema);
  
  module.exports = feeType;