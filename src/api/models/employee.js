const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    joiningDate: {
        type: Date,
        default:null,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    experienceDetails: {
        type: String,
        required: false
    },
    totalExperience: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: false
    },
    bloodGroup: {
        type: String,
        required: false
    },
    religion: {
        type: String,
        required: false
    },
    dob: {
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
        required: true
    },
    image: {
        type: String,
        required: false
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    facebook: {
        type: String,
        required: false
    },
    twitter: {
        type: String,
        required: false
    },
    linkedin: {
        type: String,
        required: false
    },
    skipBankDetails: {
        type: Boolean,
        default: false
    },
    bankName: { type: String, required: false },
    holderName: { type: String, required: false },
    bankBranch: { type: String, required: false },
    bankAddress: { type: String, required: false },
    ifscCode: { type: String, required: false },
    accountNumber: { type: String, required: false },
    designation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation'},
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department'},
    salaryGrade: { type: mongoose.Schema.Types.ObjectId, ref: 'Salary'},
  });
  
  const employees = new mongoose.model("Employee", employeeSchema);
  
  module.exports = employees;