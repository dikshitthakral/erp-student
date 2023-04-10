const { string } = require("joi");
const mongoose = require("mongoose");

const noticeBoardSchema = new mongoose.Schema({
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
    }
  });
  
  const noticeBoard = new mongoose.model("NoticeBoard", noticeBoardSchema);
  
  module.exports = noticeBoard;