const mongoose = require("mongoose");

const feePlanSchema = new mongoose.Schema({
      date: {
        type: Array,
        required: true
      },
      frequency: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Semi Annual' ,'Annual'],
        required: true
      }
    });


const feePlan = new mongoose.model("FeePlan", feePlanSchema);

module.exports = feePlan;