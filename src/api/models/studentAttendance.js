const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
  },
  { autoIndex: false, autoCreate: false }
);

const studentaAttendanceSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["fullDay", "halfDay", "absent"],
      required: true,
    },
    date: {
      type: String,
      default:"",
    },
    monthYear: {
      type: String,
    },
    students: [studentSchema],
  },
  (createAt = { timestamps: true, autoIndex: false, autoCreate: false })
);

const studentAttendance = new mongoose.model(
  "StudentAttendance",
  studentaAttendanceSchema
);

module.exports = studentAttendance;
