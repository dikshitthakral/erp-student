const mongoose = require("mongoose");

const advanceSalarySchema = new mongoose.Schema({
    deductMonth: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        default: 0,
    },
    reason: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        default: 'PENDING',
    },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
    comments: { 
        type: String,
        required: false, 
    },
    appliedOn: {
        type: Date,
        default: Date.now()
    }
});

const advanceSalary = new mongoose.model("AdvanceSalary", advanceSalarySchema);
module.exports = advanceSalary;