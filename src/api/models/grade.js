const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gradePoint: {
        type: String,
        required: true
    },
    minPercentage: {
        type: Number,
        required: true
    },
    maxPercentage: {
        type: Number,
        required: true
    },
    remarks: {
        type: String,
        required: false
    }
  });
  
  const grade = new mongoose.model("Grade", gradeSchema);
  
  module.exports = grade;