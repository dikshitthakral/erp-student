const leavesRequest = require('../../models/humanResources/leavesRequest');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');
const { uploadAttachment } = require('../../utils');


const totalDays = (date_1, date_2) => {
    let difference = date_1.getTime() - date_2.getTime();
    let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return totalDays;
}

const create = async (req, res) => {
  try {
      const { toDate, fromDate, leaveType, reason, status, employee, classTeacher, student } = req.body;
      if(isEmpty(toDate) || isEmpty(fromDate) || isEmpty(leaveType)) {
          return res.status(400).send({
              messge: "Mandatory fields missing while creating Leaves Request.",
              success: false,
          });
      }
      const file = req.file;
      let attachment = '';
      if(file) {
          attachment = await uploadAttachment(file);
      }
      const newLeavesRequest = await leavesRequest.create({
          leaveType,
          toDate,
          fromDate,
          status: isEmpty(status) ? 'PENDING' : status,
          reason: isEmpty(reason) ? undefined : reason,
          classTeacher: isEmpty(classTeacher) ? null : classTeacher,
          employee: isEmpty(employee) ? null : employee,
          days: totalDays(new Date(toDate), new Date(fromDate)),
          attachment: isEmpty(attachment) ? undefined : attachment,
          student: isEmpty(student) ? null : student,
      });
      return res.status(200).json({
          leavesRequest: newLeavesRequest,
          message: "Added New Leaves Request Successfully",
          success: true,
      });
  }catch (err) {
      return res.status(400)
          .json([{ msg: err.message, res: "error" }]);
  }
}

const getAll = async (req, res) => {
    try {
        let allLeavesRequest = await leavesRequest.find().populate('leaveType').populate('employee')
        .populate('classTeacher').populate({
          path: 'student',
          populate: [{
            path: 'academic',
            populate: [{path: 'studentClass', model: 'Class'}, {path: 'section', model: 'Section'}]
          }]
        }).exec();
        if (
            allLeavesRequest !== undefined &&
            allLeavesRequest.length !== 0 &&
            allLeavesRequest !== null
        ) {
          return res.status(200).send({
            leavesRequest: allLeavesRequest,
            messge: "All Leaves Request",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Leaves Request does not exist",
            success: false,
          });
        }
      } catch (error) {
        return res.status(400).send({
          messge: "Something went wrong",
          success: false,
        });
      }
}

const remove = async (req, res) => {
  try {
      const { id } = req.body;
      if (!id) {
        return res.status(200).json({
          message: "Leaves Request Id not found",
          success: false,
        });
      } else if (id !== undefined && id !== null && id !== "") {
        const deleteLeavesRequest = await leavesRequest.deleteOne({ _id: id });
        if (
          deleteLeavesRequest["deletedCount"] === 0 ||
          deleteLeavesRequest === null ||
          deleteLeavesRequest === undefined
        ) {
          return res.status(404).json({
            id,
            message: "leaves Request Not found ",
            success: true,
          });
        } else if (
          deleteLeavesRequest["deletedCount"] === 1 &&
          deleteLeavesRequest !== null &&
          deleteLeavesRequest !== undefined
        ) {
          return res.status(200).json({
            id,
            message: "Leaves Request Deleted Successfully !!! ",
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

const updateStatus = async (req, res) => {
    try {
      const { leavesRequestId, status } = req.body;
      let updateStatusForLeaveRequest= await leavesRequest.findOneAndUpdate(
        { _id: leavesRequestId },
        { $set: { status: status } }
      );
      if (
        updateStatusForLeaveRequest.length === 0 ||
        updateStatusForLeaveRequest === undefined ||
        updateStatusForLeaveRequest === null ||
        updateStatusForLeaveRequest === ""
      ) {
          return res.status(400)
              .json([{ msg: "Employee not found!!!", res: "error", }]);
      }
      const leavesRequestData = await leavesRequest.find({ _id: leavesRequestId}).populate('leaveType').populate('employee').exec();
      return res.status(200)
          .json([{ msg: "LeavesRequest updated with status successflly", data: leavesRequestData, res: "success" }]);
  } catch(err) {
      return res.status(500).send({
          messge: "Somethig went wrong",
          success: false,
      });
  }
}

module.exports = { create, getAll, remove, updateStatus };