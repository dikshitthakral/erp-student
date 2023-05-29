const mongoose = require("mongoose");

const feeMonthSchema = new mongoose.Schema({
    modeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeeMode",
        required: true,
    },
  month: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Unpaid",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const feeMonth = new mongoose.model("FeeMonth", feeMonthSchema);

module.exports = feeMonth;
