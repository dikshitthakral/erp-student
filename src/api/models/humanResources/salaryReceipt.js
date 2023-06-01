const mongoose = require("mongoose");

const salaryReceiptSchema = new mongoose.Schema({
    salaryPaidMonth: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'NOT-PAID'
    },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
    totalAllowance: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    overtimeHrs: { type: Number, default: 0 },
    overtimeAmount: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    payVia: { type: String, default: 'CASH' },
    account: { type: String, required: false}
});

const salaryReceipt = new mongoose.model("SalaryReceipt", salaryReceiptSchema);
module.exports = salaryReceipt;