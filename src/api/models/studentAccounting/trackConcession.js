const mongoose = require("mongoose");

const trackConcessionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    concessionInPercentage: {
        type: String,
        default: ""
    },
    amount: {
        type: Number,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const trackConcession = new mongoose.model("trackConcession", trackConcessionSchema);

module.exports = trackConcession;
