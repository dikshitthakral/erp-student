const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  bannerName: {
    type: String,
    default: "",
    required: true,
  },
  bannerImage: {
    type: String,
    default: "",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const bannerModal = new mongoose.model("Banner", bannerSchema);

module.exports = bannerModal;
