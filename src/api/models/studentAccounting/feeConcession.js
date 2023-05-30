const mongoose = require("mongoose");

const feeConcessionSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  feemode: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  studentClass: {
    type: mongoose.Schema.Types.ObjectId,
  },
  totalFinalAmount: {
    type: String,
    required: true,
  },
  allFee: {
    type: Array,
    required: true,
  },
  allMode:{
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const feeConcession = new mongoose.model("FeeConcession", feeConcessionSchema);

module.exports = feeConcession;
