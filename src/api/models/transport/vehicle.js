const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    attachement1: {
        type: String,
        required: false
    },
    attachement2: {
        type: String,
        required: false
    },
    attachement3: {
        type: String,
        required: false
    },
  }, { autoIndex: false, autoCreate: false });
  
new mongoose.model("Expense", expenseSchema);

const vehicleSchema = new mongoose.Schema({
    vehicleNo: {
        type: String,
        unique:true,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    insuranceRenewalDate: {
        type: Date,
        required: true
    },
    driverName: {
        type: String,
        required: true
    },
    driverPhoneNo: {
        type: String,
        required: true
    },
    driverLicense: {
        type: String,
        required: true
    },
    expenses: {
        type: [expenseSchema],
        default: []
    },
  });
  
  const vehicle = new mongoose.model("Vehicle", vehicleSchema);
  
  module.exports = vehicle;