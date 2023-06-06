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
    alreadyExists: {
        type: Boolean,
        required: false,
        default: false
    },
    occupation: {
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
        default: "",
        required: true
    },
    isPrimary:{
        type:Boolean,
        default:false
    }
  });
  
  const guardian = new mongoose.model("Guardian", guardianSchema);
  
  module.exports = guardian;
