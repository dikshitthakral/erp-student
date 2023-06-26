const dailyReport = require("../models/principalDailyReport");
const mongoose = require("mongoose");
const { isEmpty } = require("lodash");

// filter
const create = async (req, res) => {
  const {
    date,
    teacherPresent,
    studentPresent,
    roundTaken,
    observedByPrincipal,
    participated,
    wonCompetition,
    evenetConduct,
  } = req.body;
  if (isEmpty(date) || isEmpty(teacherPresent) || isEmpty(studentPresent)) {
    return res.status(400).json({ msg: "All field are required" });
  }
  try {
    let dateStr = date;
    const [day, month, year] = dateStr.split("/");
    const date1 = new Date(year, month - 1, day);
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = date1.getDay();
    const weekdayName = weekdays[dayOfWeek];
    const newDailyReport = new dailyReport({
      date,
      day: weekdayName,
      teacherPresent,
      studentPresent,
      roundTaken,
      observedByPrincipal,
      participated,
      wonCompetition,
      evenetConduct,
    });
    const savedDailyReport = await newDailyReport.save();
    if (!savedDailyReport) {
      return res
        .status(400)
        .json({ msg: "Daily Report not saved", res: "error" });
    }
    return res.status(200).json({ msg: "Daily Report saved", res: "success" });
  } catch (error) {}
};

// get reoprt by date
const getReportByDate = async (req, res) => {
  const { date } = req.body;
  if (isEmpty(date)) {
    return res.status(400).json({ msg: "Date is required", res: "error" });
  }
  try {
    const report = await dailyReport.findOne({ date });
    if (!report) {
      return res.status(400).json({ msg: "Report not found", res: "error" });
    }
    return res
      .status(200)
      .json({ msg: "Report found", res: "success", report });
  } catch (error) {
    return res.status(400).json({ msg: "Report not found", res: "error" });
  }
};

module.exports = {
  create,
  getReportByDate,
};
