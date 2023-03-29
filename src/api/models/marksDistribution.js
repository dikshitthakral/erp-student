const mongoose = require("mongoose");

const marksDistributionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: false
    }
  });
  
  const marksDistribution = new mongoose.model("MarksDistribution", marksDistributionSchema);
  
  module.exports = marksDistribution;