const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    }],
    classNumeric: {
        type: Number,
        required: false
    },
});
  
const classModel = new mongoose.model("Class", classSchema);
  
module.exports = classModel;