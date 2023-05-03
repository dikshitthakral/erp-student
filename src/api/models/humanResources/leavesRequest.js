const mongoose = require("mongoose");

const leavesRequestSchema = new mongoose.Schema({
    toDate: {
        type: Date,
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    leaveType: { type: mongoose.Schema.Types.ObjectId, ref: 'LeavesCategory'},
    reason: {
        type: String,
        required: false
    },
    attachment: {
        type: String,
        required: false
    },
    status: {
        type: String,
        default: 'Pending'
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Employee'
    },
    days: {
        type: Number,
        default: 0
    },
    createdAt: { type: Date, default: Date.now },
    // For Student leaves
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
});

const leavesRequest = new mongoose.model("LeavesRequest", leavesRequestSchema);
module.exports = leavesRequest;