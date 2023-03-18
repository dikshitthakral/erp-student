const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam'
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student'
    },
    academic: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Academic'
    },
    isAbsent: {
        type: Boolean,
        required: false
    },
    practical: {
        type: Number,
        required: false,
        default: 0
    },
    written: {
        type: Number,
        required: false,
        default: 0
    },
});
  
const marks = new mongoose.model("Marks", marksSchema);
  
module.exports = marks;