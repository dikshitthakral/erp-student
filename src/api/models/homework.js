const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema({
    academic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Academic'
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject'
    },
    dateOfHomework: {
        type: Date,
        required: true
    },
    dateOfSubmission: {
        type: Date,
        required: false
    },
    scheduleDate: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
        required: false
    },
  });
  
  const homework = new mongoose.model("Homework", homeworkSchema);
  
  module.exports = homework;