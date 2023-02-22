const mongoose = require("mongoose");

const vehicleRouteSchema = new mongoose.Schema({
    vehicleRouteId: {
        type: String,
        unique: true,
        required: true
    },
    routeId: {
        type: String,
        required: true
    },
    vehicleId: {
        type: String,
        required: true
    },
    stoppageId: {
        type: String,
        required: true
    }
  });
  
  const vehicleRoute = new mongoose.model("VehicleRoute", vehicleRouteSchema);
  
  module.exports = vehicleRoute;