const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
    routeId: {
        type: String,
        unique: true, 
        required: true
    },
    routeName: {
        type: String,
        unique: true, 
        required: true
    },
    startPlace: {
        type: String,
        required: true
    },
    stopPlace: {
        type: String,
        required: true
    },
    remarks: {
        type: String,
        required: true
    }
  });
  
  const route = new mongoose.model("Route", routeSchema);
  
  module.exports = route;