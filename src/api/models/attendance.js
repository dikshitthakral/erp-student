const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    isPresent: {
        type: Boolean,
        default: false
    },
    dateOfAttendance: {
        type: Date,
        default: new Date()
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    academic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Academic'
    },
  });
  
  const attendance = new mongoose.model("Attendance", attendanceSchema);
  
  module.exports = attendance;