const mongoose = require("mongoose");

const awardSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
    designation: {
        type: String,
        required: true
    },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    name: {
        type: String,
        required: true
    },
    giftItem: {
        type: String,
        required: true
    },
    cashPrice: {
        type: Number,
        default: 0,
    },
    awardReason: {
        type: String,
        required: true
    },
    givenDate: {
        type: Date,
        default: new Date()
    },
});

const award = new mongoose.model("Award", awardSchema);
module.exports = award;