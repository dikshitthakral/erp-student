const mongoose = require("mongoose");

const transportFeeSchema = new mongoose.Schema({
    year:{
        type: String,
        required: true
    },
    distance:{
        type: Number,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    code:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const transportFee = new mongoose.model("TransportFee", transportFeeSchema);
module.exports = transportFee;