const mongoose = require("mongoose");

const booksIssueSchema = new mongoose.Schema({
    bookTitle: {
        type: String,
        default: null,
        required: true
    },
    dateOfIssue: {
        type: String,
        required: true
    },
    dateOfExpiry: {
        type: String,
        required: true
    },
    fine: {
        type: Number,
        default: 0 
    },
    status: {
        type: String,
        required: true,
        default: 'ISSUED'
    },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
  });
  
  const booksIssue = new mongoose.model("BooksIssue", booksIssueSchema);
  
  module.exports = booksIssue;