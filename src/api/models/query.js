const { mongoose, Schema } = require("mongoose");


const querySchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    questionAttachment: {
        type: String,
        required: false
    },
    answer: {
        type: String,
        default:null
    },
    answerAttachment: {
        type: String,
        required: false
    },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
}, { timestamps: true });


const query = new mongoose.model("query", querySchema);

module.exports = query;
