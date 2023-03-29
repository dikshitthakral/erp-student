const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    term: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExamTerm'
    },
    examtype: {
        type: String,
        required: true
    },
    marksDistribution: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MarksDistribution'
    }],
    remarks: {
        type: String,
        required: false
    },
  });
  
  const exam = new mongoose.model("Exam", examSchema);
  
  module.exports = exam;