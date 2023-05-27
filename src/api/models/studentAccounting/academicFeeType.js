const mongoose = require("mongoose");

const academicFeeTypeSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  // all fee category list
  feeCategory: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const academicFeeType = new mongoose.model(
  "AcademicFeeType",
  academicFeeTypeSchema
);

module.exports = academicFeeType;
