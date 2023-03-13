const mongoose = require("mongoose");

const deductionSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    amount: { type: Number, default: 0},
}, { autoIndex: false, autoCreate: false });

new mongoose.model("Deduction", deductionSchema);

const allowanceSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    amount: { type: Number, default: 0},
}, { autoIndex: false, autoCreate: false });

new mongoose.model("Allowance", allowanceSchema);

const salarySchema = new mongoose.Schema({
    allowances: {
        type: [allowanceSchema],
        default: []
    },
    salaryGrade: {
        type: String,
        required: true,
    },
    basicSalary: {
        type: Number,
        default: 0,
    },
    overTimeRatePerHr: {
        type: Number,
        default: 0,
    },
    deductions: { type: [deductionSchema], default: [] },
    totalAllowance: {
        type: Number,
        default: 0,
    },
    totalDeductions: {
        type: Number,
        default: 0,
    },
    netSalary: {
        type: Number,
        default: 0,
    },
});

const salary = new mongoose.model("Salary", salarySchema);
module.exports = salary;