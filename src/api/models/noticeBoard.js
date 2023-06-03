const { string } = require("joi");
const mongoose = require("mongoose");

const noticeBoardSchema = new mongoose.Schema({
    noticeBoardType: {
        type: String,
        required: true,
        enum: ['guardian', 'teacher',]
    },
    name: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    noticeDate: {
        type: Date,
        default: new Date()
    },
    imageAttachment: {
        type: String,
        required: false
    },
    createdAt: { type: Date, default: Date.now },
  });
  
  const noticeBoard = new mongoose.model("NoticeBoard", noticeBoardSchema);
  
  module.exports = noticeBoard;
