const mongoose = require("mongoose");
const validatorPackage = require('validator');

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: validatorPackage.isAlpha,
            message: 'Please provide a valid section name'
        }
    },
    capacity: {
        type: Number,
        required: false
    },
  });
  
  const section = new mongoose.model("Section", sectionSchema);
  
  module.exports = section;