const mongoose = require("mongoose");

const examTermSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: false
    }
  });
  
  const examTerm = new mongoose.model("ExamTerm", examTermSchema);
  
  module.exports = examTerm;