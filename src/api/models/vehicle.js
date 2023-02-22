const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    vehicleNo: {
        type: String,
        required: false
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
    }
  });
  
  const vehicle = new mongoose.model("Vehicle", vehicleSchema);
  
  module.exports = vehicle;