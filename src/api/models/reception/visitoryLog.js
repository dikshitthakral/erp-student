const mongoose = require("mongoose");

const visitorLogSchema = new mongoose.Schema({
    visitingPuprose: {
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
    entryTime: {
        type: String,
        required: false
    },
    exitTime: { 
        type: String,
        required: false
    },
    noOfVisitors: {
        type: Number,
        required: false
    },
    idNumber: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: false
    },
    note: {
        type: String,
        required: false
    }
  });
  
  const visitorLog = new mongoose.model("VisitorLog", visitorLogSchema);
  
  module.exports = visitorLog;