const mongoose = require("mongoose");

const fineSetupSchema = new mongoose.Schema({
    fineType: {
        type: String,
        required: false
    },
    feeType: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeType' },
    fineValue: {
        type: Number,
        required: true
    },
    lateFeeFrequency: {
        type: String,
        required: false
    }
  });
  
  const fineSetup = new mongoose.model("FineSetup", fineSetupSchema);
  
  module.exports = fineSetup;