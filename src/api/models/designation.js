const mongoose = require("mongoose");

const designationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  });
  
  const designation = new mongoose.model("Designation", designationSchema);
  
  module.exports = designation;