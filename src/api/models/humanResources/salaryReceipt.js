const mongoose = require("mongoose");

const salaryReceiptSchema = new mongoose.Schema({
    salaryPaidMonth: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true,
        default: 'NOT-PAID'
    },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
});

const salaryReceipt = new mongoose.model("SalaryReceipt", salaryReceiptSchema);
module.exports = salaryReceipt;