const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    type: {
      type: String,
      enum: ["Present", "Absent", "Half Day", "Late"],
      required: true,
    },
  },
  { autoIndex: false, autoCreate: false }
);

const employeeAttendanceSchema = new mongoose.Schema(
  {
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      required: true,
    },
    date: {
      type: String,
      default: "",
    },
    employee: [employeeSchema],
  },
  (createAt = { timestamps: true, autoIndex: false, autoCreate: false })
);

const employeeAttendance = new mongoose.model(
  "EmployeeAttendance",
  employeeAttendanceSchema
);

module.exports = employeeAttendance;