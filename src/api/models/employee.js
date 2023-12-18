const mongoose = require("mongoose");
const validatorPackage = require('validator');

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
        required: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
        required: true,
        validate: {
            validator: validatorPackage.isMobilePhone,
            message: 'Please provide a valid phone number'
        }
    },
    email: {
        type: String,
        unique: false,
        default: null,
        required: true,
        validate: {
            validator: validatorPackage.isEmail,
            message: 'Please provide a valid email',
        }
    },
    presentAddressHouseNo: {
        type: String,
        required: false
    },
    presentAddressStreet: {
        type: String,
        required: false
    },
    presentAddressZipCode: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                if(v === undefined || v === null || v === '') {
                    return true;
                }
                return /^\d+$/.test(v);
            },
            message: 'Please provide a valid zip code',
        }
    },
    presentAddressCity: {
        type: String,
        required: false
    },
    presentAddressState: {
        type: String,
        required: false
    },
    premanentAddressHouseNo: {
        type: String,
        required: false
    },
    premanentAddressStreet: {
        type: String,
        required: false
    },
    premanentAddressZipCode: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                if(v === undefined || v === null || v === '') {
                    return true;
                }
                return /^\d+$/.test(v);
            },
            message: 'Please provide a valid zip code',
        }
    },
    premanentAddressCity: {
        type: String,
        required: false
    },
    premanentAddressState: {
        type: String,
        required: false
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