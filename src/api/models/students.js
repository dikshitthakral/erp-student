const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    registerNo: {
        type: Number,
        required: true
    },
    rollNo: {
        type: Number,
        required: true
    },
    admissionDate: {
        type: Date,
        default:null
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: false
    },
    dob: {
        type: String,
        required: true
    },
    motherTongue: {
        type: String,
        required: false
    },
    religion: {
        type: String,
        required: false
    },
    caste: {
        type: String,
        required: false
    },
    number: {
        type: String,
        unique: false,
        required: true
    },
    email: {
        type: String,
        unique: false,
        default: null,
        required: true
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    presentAddress: {
        type: String,
        required: false
    },
    permanentAddress: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    idCardDocument : {
        type: String,
        required: false
    },
    previousSchoolName: {
        type: String,
        required: false
    },
    previousQualification: {
        type: String,
        required: false
    },
    previousRemarks: {
        type: String,
        required: false
    },
    transportRoute: {
        type: String,
        required: false
    },
    vehicleNo: {
        type: String,
        required: false
    },
    academic: { type: mongoose.Schema.Types.ObjectId, ref: 'Academic'},
    guardian: { type: mongoose.Schema.Types.ObjectId, ref: 'Guardian'},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  });
  
  const students = new mongoose.model("Student", studentSchema);
  
  module.exports = students;