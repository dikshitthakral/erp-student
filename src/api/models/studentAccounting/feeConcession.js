const mongoose = require("mongoose");

const feeConcessionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  feemode: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  concession: {
    type: Array,
  },
  totalAmount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const feeConcession = new mongoose.model("FeeConcession", feeConcessionSchema);

module.exports = feeConcession;
