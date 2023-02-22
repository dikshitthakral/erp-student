const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        default: null,
        required: false
    },
    description: {
        type: String,
        required: false
    }
  });
  
  const category = new mongoose.model("Category", categorySchema);
  
  module.exports = category;