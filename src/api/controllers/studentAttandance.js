const attendance = require("../models/studentAttendance");
const academicsService = require("../services/academic");
const mongoose = require("mongoose");
const { isEmpty } = require("lodash");
const students = require("../models/students");

const create = async (req, res) => {
  try {
    const { classId, sectionId, year, type, students } = req.body;
    if (
      isEmpty(classId) ||
      isEmpty(sectionId) ||
      isEmpty(year) ||
      isEmpty(type) ||
      isEmpty(students)
    ) {
      return res
        .status(400)
        .json([{ msg: "All fields are required", res: "error" }]);
    }
    let studentArray = [];
    students.map((student) => {
      studentArray.push({ student: student });
    });
    const newAttendance = new attendance({
      classId,
      sectionId,
      year,
      type,
      students: studentArray,
      date: new Date().toLocaleDateString(),
    });
    const result = await newAttendance.save();
    if (result) {
      return res
        .status(200)
        .json([{ msg: "Attendance created successfully", res: "success" }]);
    } else {
      return res
        .status(400)
        .json([{ msg: "Attendance not created", res: "error" }]);
    }
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

// get all attendance
const getAll = async (req, res) => {
  try {
    const result = await attendance
      .find()
      //   .populate("classId")
      //   .populate("sectionId")
      .populate("students.student", "registerNo firstName -_id");
    if (result) {
      return res.status(200).json([
        {
          msg: "Attendance fetched successfully",
          res: "success",
          data: result,
        },
      ]);
    } else {
      return res
        .status(400)
        .json([{ msg: "Attendance not fetched", res: "error" }]);
    }
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

// get all data by classId, sectionId, year
const getAllByHalfdayList = async (req, res) => {
  try {
    const { studentClass, section, academicYear, date } = req.body;
    if (isEmpty(studentClass) || isEmpty(section) || isEmpty(academicYear)) {
      return res
        .status(400)
        .json([{ msg: "All fields are required", res: "error" }]);
    }
    const findAcademic = await academicsService.getIdIfAcademicExists({
      academicYear,
      studentClass,
      section,
    });
    if (findAcademic === null) {
      return res.status(400).send({
        messge: "Academic not found.",
        success: false,
      });
    }
    const findStudent = await students.find({ academic: findAcademic._id });
    if (findStudent.length === 0) {
      return res.status(400).send({
        data:[],
        messge: "Student not found.",
        success: false,
      });
    }
    const findAttendance = await attendance.find({
      classId: studentClass,
      sectionId: section,
      year: academicYear,
      type: "fullDay",
      date: date,
    });
    if (findAttendance.length === 0) {
      return res.status(200).send({
        data:[],
        messge: "Attendance not found.",
        success: false,
      });
    }
    let allStudent = findStudent;
    let allAttendance = findAttendance[0]?.students;
    let studentArray = [];
    allStudent.map((student) => {
      let isPresent = false;
      allAttendance.map((attendance) => {
        if (student?._id.toString() === attendance?.student.toString()) {
          isPresent = true;
        }
      });
      if (!isPresent) {
        studentArray.push({
          _id: student._id,
          firstName: student.firstName,
          lastNAme: student.lastName,
          registerNo: student.registerNo,
        });
      }
    });
    if (studentArray.length > 0) {
      return res.status(200).send({
        messge: "list fetched successfully.",
        success: true,
        data: studentArray,
      });
    }
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

const getAllAbsentList = async (req, res) => {
  try {
    const { studentClass, section, academicYear, date } = req.body;
    if (isEmpty(studentClass) || isEmpty(section) || isEmpty(academicYear)) {
      return res
        .status(400)
        .json([{ msg: "All fields are required", res: "error" }]);
    }
    const findAcademic = await academicsService.getIdIfAcademicExists({
      academicYear,
      studentClass,
      section,
    });
    if (findAcademic === null) {
      return res.status(400).send({
        messge: "Academic not found.",
        success: false,
      });
    }
    const findStudent = await students.find({ academic: findAcademic._id });
    if (findStudent.length === 0) {
      return res.status(400).send({
        data:[],
        messge: "Student not found.",
        success: false,
      });
    }
    const fullDay = await attendance.find({
      classId: studentClass,
      sectionId: section,
      year: academicYear,
      type: "fullDay",
      date: date,
    });
    const halfDay = await attendance.find({
      classId: studentClass,
      sectionId: section,
      year: academicYear,
      type: "halfDay",
      date: date,
    });
    let allStudent = findStudent;
    let allAttendance = fullDay[0]?.students;
    let allHalfDay = halfDay[0]?.students;
    let studentArray = [];
    allStudent.map((student) => {
      let isPresent = false;
      allAttendance?.map((attendance) => {
        if (student?._id.toString() === attendance?.student.toString()) {
          isPresent = true;
        }
      });
      allHalfDay?.map((attendance) => {
        if (student?._id.toString() === attendance?.student.toString()) {
          isPresent = true;
        }
      });
      if (!isPresent) {
        studentArray.push({
          _id: student._id,
          firstName: student.firstName,
          lastNAme: student.lastName,
          registerNo: student.registerNo,
        });
      }
    });
    if (studentArray.length > 0) {
      return res.status(200).send({
        messge: "list fetched successfully.",
        success: true,
        data: studentArray,
      });
    }
    
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

// get all data attandance by classId, sectionId, year
const getAllAttandance = async (req, res) => {
  try {
    const { studentClass, section, academicYear, date } = req.body;
    if (isEmpty(studentClass) || isEmpty(section) || isEmpty(academicYear)) {
      return res
        .status(400)
        .json([{ msg: "All fields are required", res: "error" }]);
    }
    
    const findAttandance = await attendance.find({
      classId: studentClass,
      sectionId: section,
      year: academicYear,
      date: date,
    })
    .populate("students.student", "firstName lastName registerNo")
    let data = [];
    findAttandance.map((item) => {
      item?.students.map((student) => {
        data.push({
          _id: student?.student,
          type: item?.type,
          date: item?.date,
        });
      });
    });
    if (data.length > 0) {
      return res.status(200).send({
        messge: "list fetched successfully.",
        success: true,
        data: data,
      });
    } else {
      return res.status(400).send({
        messge: "Attendance not found.",
        success: false,
      });
    }
    
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};



module.exports = { create, getAll, getAllByHalfdayList,getAllAbsentList,getAllAttandance };