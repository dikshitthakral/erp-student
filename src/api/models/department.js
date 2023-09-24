const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    departmentId:{
        type:Number,
        required:true
    },
    description: {
        type: String,
        required: false
    }
  });
  
  const department = new mongoose.model("Department", departmentSchema);
  
  module.exports = department;
