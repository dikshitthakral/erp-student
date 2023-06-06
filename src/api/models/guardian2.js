const mongoose = require("mongoose");

const guardian2Schema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    relation: {
        type: String,
        required: false
    },
    occupation: {
        type: String,
        required: false
    },
    number: {
        type: String,
    },
    email: {
        type: String,
        unique: false,
        default: "",
    },
    isPrimary:{
        type:Boolean,
        default:false
    }
  });
  
  const guardian2 = new mongoose.model("Guardian2", guardian2Schema);
  
  module.exports = guardian2;
