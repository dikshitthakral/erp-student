const { mongoose, Schema } = require("mongoose");


const querySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["student", "teacher"],
        required: true,
      },
    question: {
        type: String,
        default:""
    },
    questionAttachment: {
        type: String,
        default:""
    },
    answer: {
        type: String,
        default:""
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
