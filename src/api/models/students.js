const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema({
    feeType: {
        type: mongoose.Schema.Types.ObjectId, ref: 'FeeType',
    },
    discount: {
        type: Number, required: false, default: 0
    },
    paidAmount: {
        type: Number, default: 0
    },
    totalAmount: {
        type: Number, default: 0
    },
    status: {
        type: String, default: 'UNPAID'
    },
    balance: {
        type: Number, default: 0
    },
    fine: {
        type: Number, default: 0
    }
}, { autoIndex: false, autoCreate: false });

new mongoose.model("Fees", feesSchema);

const studentSchema = new mongoose.Schema({
    registerNo: {
        type: Number,
        required: false,
        default: 100000
    },
    rollNo: {
        type: Number,
        required: false
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
        required: false
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
        required: false
    },
    email: {
        type: String,
        unique: false,
        default: null,
        required: true
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
        required: false
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
        required: false
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
    vehicleNo: {
        type: String,
        required: false
    },
    academic: { type: mongoose.Schema.Types.ObjectId, ref: 'Academic'},
    guardian: { type: mongoose.Schema.Types.ObjectId, ref: 'Guardian'},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    vehicleRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'VehicleRoute'},
    fees: {
        type: [feesSchema],
        default: []
    },
    active: { type: Boolean, default: true }
});
  
  const students = new mongoose.model("Student", studentSchema);
  
  module.exports = students;