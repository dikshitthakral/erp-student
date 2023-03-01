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
    isAbsent: {
        type: Boolean,
        required: false
    },
    practical: {
        type: Number,
        required: false
    },
    written: {
        type: Number,
        required: false
    },
});
  
const marks = new mongoose.model("Marks", marksSchema);
  
module.exports = marks;