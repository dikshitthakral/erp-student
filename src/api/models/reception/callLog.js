const mongoose = require("mongoose");

const callLogSchema = new mongoose.Schema({
    callType: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: false
    },
    timeSlotTo: {
        type: String,
        required: false
    },
    timeSlotFrom: { // To-Do: confirm this field
        type: String,
        required: false
    },
    followUpDate: {
        type: Date,
        required: false
    },
    note: {
        type: String,
        required: false
    }
  });
  
  const callLog = new mongoose.model("CallLog", callLogSchema);
  
  module.exports = callLog;