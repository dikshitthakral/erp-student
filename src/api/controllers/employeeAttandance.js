const attendance = require("../models/employeeAttendance");
const employees = require("../models/employee");
const designations = require("../models/designation");
const mongoose = require("mongoose");
const { isEmpty } = require("lodash");

// filter
const 
filter = async (req, res) => {
  const { designation, date, department } = req.body;
  if ((isEmpty(designation) && isEmpty(department)) || isEmpty(date)) {
    return res
      .status(400)
      .json([{ msg: "All fields are required", res: "error" }]);
  }
  try {
    let findObj = { date };
    if(!isEmpty(designation)) {
      findObj["designation"] = designation;
    }
    if(!isEmpty(department)) {
      findObj["department"] = department;
    }
    const empAttandance = await attendance
      .find({ ...findObj })
      .populate("employee.employeeId", "name image designation department");
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
          department: emp.employeeId.department
            ? emp.employeeId.department
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
      let findObj = {};
      if(!isEmpty(designation)) {
        findObj["designation"] = designation;
      }
      if(!isEmpty(department)) {
        findObj["department"] = department;
      }
      const emp = await employees
        .find({ ...findObj })
        .select(" _id name image designation department");
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
  const { designation, date, employee, department } = req.body;
  if (isEmpty(designation) || isEmpty(department) || isEmpty(date) || isEmpty(employee)) {
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
        department
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

// filter employee attandance by month and designation
const filterByMonth = async (req, res) => {
  const { designation, date } = req.body;
  if (isEmpty(designation) || isEmpty(date)) {
    return res
      .status(400)
      .json([{ msg: "All fields are required", res: "error" }]);
  }
  try {
    const empAttandance = await attendance
      .find({ designation, monthYear: date })
      .populate("employee.employeeId", "name");
    if (empAttandance.length >= 1) {
      let empArray = [];
      empAttandance.map((e) => {
        e?.employee?.map((emp) => {
          empArray?.push({
            id: emp?.employeeId?._id ? emp?.employeeId?._id : "",
            name: emp?.employeeId?.name ? emp.employeeId?.name : "",
            type: emp?.type ? emp?.type : "",
          });
        });
      });
      const getUniqueValues = (arr, key) => {
        return [...new Map(arr.map((item) => [item[key], item])).values()];
      };
      const empCounts = {};
      empArray.forEach((item) => {
        if (!empCounts[item?.id]) {
          empCounts[item?.id] = {
            id: item?.id,
            name: item?.name,
            totalPresentCount: 0,
            totalAbsentCount: 0,
            totalHalfDayCount: 0,
          };
        }
        if (item?.type === "Present") {
          empCounts[item?.id].totalPresentCount++;
        } else if (item?.type === "Absent") {
          empCounts[item?.id].totalAbsentCount++;
        } else if (item?.type === "Half Day") {
          empCounts[item?.id].totalHalfDayCount++;
        }
      });
      const empCountsArray = Object.values(empCounts);
      return res.status(200).json([
        {
          msg: "Employee Attendance fetched successfully",
          res: "success",
          data: empCountsArray,
        },
      ]);
    } else {
      return res.status(200).json([
        {
          msg: "Employee Attendance not found",
          res: "error",
          data: [],
        },
      ]);
    }
  } catch (error) {
    return res.status(400).json([{ msg: error.message, res: "error" }]);
  }
};

module.exports = {
  filter,
  add,
  filterByMonth
};
