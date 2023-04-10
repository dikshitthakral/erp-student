const attendance = require('../models/attendance');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const create = async (req, res) => {
    try {
        const { isPresent, dateOfAttendance, student, academic } = req.body;
        if(isEmpty(String(isPresent)) || isEmpty(student) || isEmpty(academic)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating Attendance.",
                success: false,
            });
        }
        const attendanceModel = {
            dateOfAttendance : isEmpty(dateOfAttendance) ? new Date() : dateOfAttendance,
            isPresent: Boolean(isPresent),
            student,
            academic
        }
        const newAttendance = await attendance.create(attendanceModel);
        return res.status(200).json({
            attendance: newAttendance,
            message: "Added New Attendance Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAttendanceByDate = async (req, res) => {
    try {
        const { startDate, endDate, student, academic } = req.body;
        let attendanceOfStudentByDates = await attendance.find({
            student,
            academic,
            dateOfAttendance: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            }
        });
        if (
            attendanceOfStudentByDates !== undefined &&
            attendanceOfStudentByDates.length !== 0 &&
            attendanceOfStudentByDates !== null
        ) {
          let numberOfDays = attendanceOfStudentByDates.length,
              presentDays = 0,
              absentDays = 0;
          for(let attendance of attendanceOfStudentByDates) {
                if(attendance.isPresent) { presentDays++; }
                else { absentDays++ }
          }
          return res.status(200).send({
            attendances: attendanceOfStudentByDates,
            numberOfDays,
            presentDays,
            absentDays,
            messge: "All Attendance of students by dates",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Attendance does not exist",
            success: false,
          });
        }
      } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
          return res.status(200).json({
            message: "Attendace Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteAttendance = await attendance.deleteOne({ _id: id });
          if (
            deleteAttendance["deletedCount"] === 0 ||
            deleteAttendance === null ||
            deleteAttendance === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Attendance Not found ",
              success: true,
            });
          } else if (
            deleteAttendance["deletedCount"] === 1 &&
            deleteAttendance !== null &&
            deleteAttendance !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Attendance Deleted Successfully !!! ",
              success: true,
            });
          }
        }
      } catch (error) {
        return res.status(500).json({
          message: "Something went wrong",
          success: false,
        });
      }
}

const update = async (req, res) => {
    try {
        const { attendanceId, isPresent, dateOfAttendance, student, academic } = req.body;
        const updateObject = {}
        if(!isEmpty(isPresent)) { updateObject["isPresent"] = isPresent; }
        if(!isEmpty(dateOfAttendance)) { updateObject["dateOfAttendance"] = dateOfAttendance; }
        if(!isEmpty(student)) { updateObject["student"] = student; }
        if(!isEmpty(academic)) { updateObject["academic"] = academic; }
        let updateAttendance = await attendance.findOneAndUpdate(
            { _id: attendanceId },
            {
                $set: updateObject
            }
        );
        if (
            updateAttendance.length === 0 ||
            updateAttendance === undefined ||
            updateAttendance === null ||
            updateAttendance === ""
        ) {
            return res.status(200)
                .json([{ msg: "Attendance not found!!!", res: "error", }]);
        } else {
            const attendanceData = await attendance.findOne({ _id: attendanceId })
            return res.status(200)
                .json([{ msg: "Attendance updated successflly", data: attendanceData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { create, getAttendanceByDate, remove, update};