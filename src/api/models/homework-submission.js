const mongoose = require("mongoose");

const homeworkSubmissionSchema = new mongoose.Schema({
    homework: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Homework'
    },
    dateOfSubmission: {
        type: Date,
        default: new Date()
    },
    academic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Academic'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    attachment: {
        type: String,
        required: false
    }
  });
  
  const homeworkSubmission = new mongoose.model("HomeworkSubmission", homeworkSubmissionSchema);
  
  module.exports = homeworkSubmission;