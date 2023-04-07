const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: false
    },
  });
  
  const section = new mongoose.model("Section", sectionSchema);
  
  module.exports = section;