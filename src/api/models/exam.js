const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
  });
  
  const exam = new mongoose.model("Exam", examSchema);
  
  module.exports = exam;