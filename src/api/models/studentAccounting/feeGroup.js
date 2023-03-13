const mongoose = require("mongoose");

const feeGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    feeTypes: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FeeType'
    }],
    description: {
        type: String,
        required: false
    }
  });
  
  const feeGroup = new mongoose.model("FeeGroup", feeGroupSchema);
  
  module.exports = feeGroup;