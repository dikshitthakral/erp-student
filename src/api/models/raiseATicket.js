const mongoose = require("mongoose");

const raiseATicketSchema = new mongoose.Schema({
    supportType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    sendTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    status: {
        type: String,
        default: 'PENDING'
    }
  });
  
  const raiseATicket = new mongoose.model("RaiseATicket", raiseATicketSchema);
  
  module.exports = raiseATicket;