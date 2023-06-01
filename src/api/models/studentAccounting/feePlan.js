const mongoose = require("mongoose");

const feePlanSchema = new mongoose.Schema({
      frequency: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Semi Annual' ,'Annual'],
        required: true
      },
      createdAt: {
          type: Date,
          default: Date.now
      }       
    });


const feePlan = new mongoose.model("FeePlan", feePlanSchema);

module.exports = feePlan;
