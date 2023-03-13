const mongoose = require("mongoose");

const leavesCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    days: {
        type: Number,
        required: true,
        default: 0
    },
    designation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation'},
});

const leavesCategory = new mongoose.model("LeavesCategory", leavesCategorySchema);
module.exports = leavesCategory;