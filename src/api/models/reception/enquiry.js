const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    previousSchool: {
        type: String,
        required: false
    },
    fatherName: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    noOfChild: {
        type: Number,
        required: false
    },
    assigned: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: false
    },
    response: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    dateOfEnquiry: {
        type: Date,
        required: false
    },
    classApplyFor: {
        type: Number, // TO-DO: Confirm class as its a dropdown 
        required: true
    }
  });
  
  const enquiry = new mongoose.model("Enquiry", enquirySchema);
  
  module.exports = enquiry;