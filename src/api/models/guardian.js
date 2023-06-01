const mongoose = require("mongoose");

const guardianSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: true
    },
    relation: {
        type: String,
        required: false
    },
    fatherName: {
        type: String,
        required: false
    },
    motherName: {
        type: String,
        required: false
    },
    alreadyExists: {
        type: Boolean,
        required: false,
        default: false
    },
    occupation: {
        type: String,
        required: false
    },
    income: {
        type: String,
        required: false
    },
    education: {
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
    image: {
        type: String,
        required: false
    },
    idProofDocument : {
        type: String,
        required: false
    },
  });
  
  const guardian = new mongoose.model("Guardian", guardianSchema);
  
  module.exports = guardian;