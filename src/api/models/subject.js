const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    },
    subjectCode: {
        type: String,
        required: true
    },
    subjectAuthor: {
        type: String,
        required: true
    },
    subjectType: {
        type: String,
        required: true
    }
  });
  
  const subject = new mongoose.model("Subject", subjectSchema);
  
  module.exports = subject;