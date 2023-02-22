const mongoose = require("mongoose");

const academicSchema = new mongoose.Schema({
    academicYear: {
        type: String,
        default: null,
        required: true
    },
    studentClass: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    }
  });
  
  const academics = new mongoose.model("Academic", academicSchema);
  
  module.exports = academics;