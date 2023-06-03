const mongoose = require("mongoose");

const raiseATicketSchema = new mongoose.Schema({
    raiseType: {
        type: String,
        required: true,
        enum: ['guardian', 'teacher']
    },
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
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'PENDING'
    }
  });
  
  const raiseATicket = new mongoose.model("RaiseATicket", raiseATicketSchema);
  
  module.exports = raiseATicket;
