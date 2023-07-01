const mongoose = require("mongoose");

const principalDailyReportSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  teacherPresent: {
    type: Number,
    required: true,
  },
  studentPresent: {
    type: Number,
    required: true,
  },
  roundTaken: {
    type: Number,
    default: 0,
  },
  observedByPrincipal: {
    type: Number,
    default: 0,
  },
  participated: {
    type: String,
    default: "",
  },
  wonCompetition: {
    type: String,
    default: "",
  },
  evenetConduct: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const principalDailyReport = new mongoose.model(
  "PrincipalDailyReport",
  principalDailyReportSchema
);

module.exports = principalDailyReport;
