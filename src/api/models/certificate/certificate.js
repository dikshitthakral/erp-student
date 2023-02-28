const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    applicableStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    applicableEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
    pageLayout: {
        type: String,
        required: true
    },
    userPhotoStyle: {
        type: String,
        required: true
    },
    userPhotoSize: {
        type: String,
        required: true
    },
    layoutSpacing: {
        top: {
            type: String,
            required: true
        },
        bottom: {
            type: String,
            required: true
        },
        left: {
            type: String,
            required: true
        },
        right: {
            type: String,
            required: true
        },
    },
    signatureImage: {
        type: String,
        required: false
    },
    logoImage: {
        type: String,
        required: false
    },
    backgroundImage: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    }
  }, {
    timestamps: true
  });
  
  const certificate = new mongoose.model("Certificate", certificateSchema);
  
  module.exports = certificate;