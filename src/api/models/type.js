const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cretedAt: {
        type: Date,
        default: Date.now
    }
  });
  
  const type = new mongoose.model("Type", typeSchema);
  
  module.exports = type;