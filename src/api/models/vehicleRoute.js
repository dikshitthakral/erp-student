const mongoose = require("mongoose");

const vehicleRouteSchema = new mongoose.Schema({
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