const attendance = require("../models/employeeAttendance");
const employees = require("../models/employee");
const designations = require("../models/designation");
const mongoose = require("mongoose");
const { isEmpty } = require("lodash");

// filter
const filter = async (req, res) => {
  const { designation, date } = req.body;
  if (isEmpty(designation) || isEmpty(date)) {
    return res
      .status(400)
      .json([{ msg: "All fields are required", res: "error" }]);
  }
  try {
    const empAttandance = await attendance
      .find({ designation, date })
      .populate("employee.employeeId", "name image designation");
    let empArray = [];
    empAttandance.map((e) => {
      e.employee.map((emp) => {
        empArray.push({
          id: emp.employeeId._id ? emp.employeeId._id : "",
          name: emp.employeeId.name ? emp.employeeId.name : "",
          image: emp.employeeId.image ? emp.employeeId.image : "",
          designation: emp.employeeId.designation
            ? emp.employeeId.designation
            : "",
          type: emp.type ? emp.type : "",
        });
      });
    });
    if (empAttandance.length > 0) {
      return res.status(200).json([
        {
          msg: "Employee Attendance fetched successfully",
          res: "success",
          data: empArray,
        },
      ]);
    } else {
      const emp = await employees
        .find({ designation })
        .select(" _id name image designation");
      let empArray = [];
      emp.map((e) => {
        empArray.push({
          id: e._id ? e._id : "",
          name: e.name ? e.name : "",
          image: e.image ? e.image : "",
          designation: e.designation ? e.designation : "",
          type: "",
        });
      });
      if (emp) {
        return res.status(200).json([
          {
            msg: "Employee fetched successfully",
            res: "success",
            data: empArray,
          },
        ]);
      } else {
        return res
          .status(400)
          .json([{ msg: "Employee not fetched", res: "error" }]);
      }
    }
  } catch (error) {
    return res.status(400).json([{ msg: error.message, res: "error" }]);
  }
};

// add employee attendance
const add = async (req, res) => {
  const { designation, date, employee } = req.body;
  if (isEmpty(designation) || isEmpty(date) || isEmpty(employee)) {
    return res
      .status(400)
      .json([{ msg: "All fields are required", res: "error" }]);
  }
  let employeeArray = [];
  employee.map((emp) => {
    employeeArray.push({ employeeId: emp.employee, type: emp.type });
  });
   const dateArray = date.split("/");
  const newDate = dateArray[0] + "/" + dateArray[2];
  try {
    const findAttandance = await attendance.findOne({ designation, date });
    if (findAttandance) {
      const updateAttandance = await attendance.findOneAndUpdate(
        { designation, date },
        { $set: { employee: employeeArray } },
        { new: true }
      );
      if (updateAttandance) {
        return res.status(200).json([
          {
            msg: "Employee Attendance updated successfully",
            res: "success",
          },
        ]);
      }
    } else {
      const newAttendance = new attendance({
        designation,
        date,
        monthYear: newDate,
        employee: employeeArray,
      });
      const result = await newAttendance.save();
      if (result) {
        return res
          .status(200)
          .json([
            { msg: "Employee Attendance created successfully", res: "success" },
          ]);
      } else {
        return res
          .status(400)
          .json([{ msg: "Employee Attendance not created", res: "error" }]);
      }
    }
  } catch (error) {
    return res.status(400).json([{ msg: error.message, res: "error" }]);
  }
};

module.exports = {
  filter,
  add,
};
