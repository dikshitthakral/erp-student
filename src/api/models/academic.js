const mongoose = require("mongoose");

const academicSchema = new mongoose.Schema({
    academicYear: {
        type: String,
        default: null,
        required: true
    },
    studentClass: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Class'
    },
    section: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Section'
    },
    classNumeric: {
        type: Number,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    subjects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: []}]
  });
  
  const academics = new mongoose.model("Academic", academicSchema);
  
  module.exports = academics;