const mongoose = require("mongoose");

const vehicleRouteSchema = new mongoose.Schema({
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route'},
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle'},
    stoppage: { type: mongoose.Schema.Types.ObjectId, ref: 'Stoppage'},
  });
  
  const vehicleRoute = new mongoose.model("VehicleRoute", vehicleRouteSchema);
  
  module.exports = vehicleRoute;