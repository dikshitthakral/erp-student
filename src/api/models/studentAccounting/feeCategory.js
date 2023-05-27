const mongoose = require("mongoose");

const feeCategorySchema = new mongoose.Schema({
   categoryName: {
         type: String,
            required: true
        },
        code: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
  });
  
  const feeCategory = new mongoose.model("FeeCategory", feeCategorySchema);
  
  module.exports = feeCategory;