const mongoose = require("mongoose");

const assignVehicleSchema = new mongoose.Schema({
    routeId: {
        type: String,
        required: true
    },
    vehicleId: {
        type: String,
        required: true
    },
    stopPageId: {
        type: String,
        required: true
    }
  });
  
  const assignVehicle = new mongoose.model("AssignVehicle", assignVehicleSchema);
  
  module.exports = assignVehicle;