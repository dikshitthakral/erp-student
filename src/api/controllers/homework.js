const homework = require('../models/homework');
const mongoose = require('mongoose');
const { uploadAttachment } = require('../utils');
const academicsService = require('../services/academic');
const { isEmpty } = require('lodash');

const create = async (req, res) => {
    try {
        const { academicYear, studentClass, section, subject, dateOfHomework, dateOfSubmission, scheduleDate, description} = req.body;
        if(isEmpty(academicYear) || isEmpty(studentClass) || isEmpty(section) || isEmpty(subject) || isEmpty(dateOfHomework) || isEmpty(dateOfSubmission) || isEmpty(scheduleDate) || isEmpty(description)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating academic.",
                success: false,
            });
        }
        const file = req.file;
        let attachment = '';
        if(!isEmpty(file)) {
            attachment = await uploadAttachment(file);
        }
        const academicsId = await academicsService.getIdIfAcademicExists({ academicYear, section, studentClass });
        if(!mongoose.Types.ObjectId.isValid(academicsId)) {
            return res.status(400).send({
                messge: "No records found with above filter critera",
                success: false,
            });
        }
        const newHomework = await homework.create({
            academic: academicsId,
            subject,
            dateOfHomework,
            dateOfSubmission,
            scheduleDate,
            description,
            attachment:  isEmpty(attachment) ? undefined : attachment
        });
        return res.status(200).json({
            homework: newHomework,
            message: "Added New Homework Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allHomework = await homework.find().populate('subject').populate('academic');
        if (
            allHomework !== undefined &&
            allHomework.length !== 0 &&
            allHomework !== null
        ) {
          return res.status(200).send({
            homework: allHomework,
            messge: "All Homework",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Homework does not exist",
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
            message: "Homework Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteHomework = await homework.deleteOne({ _id: id });
          if (
            deleteHomework["deletedCount"] === 0 ||
            deleteHomework === null ||
            deleteHomework === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Homework Not found ",
              success: true,
            });
          } else if (
            deleteHomework["deletedCount"] === 1 &&
            deleteHomework !== null &&
            deleteHomework !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Homework Deleted Successfully !!! ",
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
        const { homeworkId, academicYear, studentClass, section, subject, dateOfHomework, dateOfSubmission, scheduleDate, description} = req.body;
        const homeworkResult = await homework.findOne({ _id: mongoose.Types.ObjectId(homeworkId)});
        if (isEmpty(homeworkResult)) {
            return res.status(400)
                .json([{ msg: "Homework not found.", res: "error", }]);
        }
        const updateObject = {}
        if(!isEmpty(academicYear) && !isEmpty(studentClass) && !isEmpty(section)) {
            const academicsId = await academicsService.getIdIfAcademicExists({ academicYear, section, studentClass });
            if(!mongoose.Types.ObjectId.isValid(academicsId)) {
                return res.status(400).send({
                    messge: "No Academic records found with above filter critera",
                    success: false,
                });
            }
            updateObject['academic'] = academicsId;
        }
        const file = req.file;
        if(!isEmpty(file)) {
            const attachment = await uploadAttachment(file);
            if(!isEmpty(attachment)) {
                updateObject['attachment'] = attachment
            }
        }
        updateObject["subject"] = !isEmpty(subject) ? subject : homeworkResult.subject;
        updateObject["dateOfHomework"] = !isEmpty(dateOfHomework) ? dateOfHomework : homeworkResult.dateOfHomework;
        updateObject["dateOfSubmission"] = !isEmpty(dateOfSubmission) ? dateOfSubmission : homeworkResult.dateOfSubmission;
        updateObject["scheduleDate"] = !isEmpty(scheduleDate) ? scheduleDate : homeworkResult.scheduleDate;
        updateObject["description"] = !isEmpty(description) ? description : homeworkResult.description;
        let updateHomework = await homework.findOneAndUpdate(
            { _id: homeworkId },
            {
                $set: updateObject
            }
        );
        if (
            updateHomework.length === 0 ||
            updateHomework === undefined ||
            updateHomework === null ||
            updateHomework === ""
        ) {
            return res.status(200)
                .json([{ msg: "Homework not found!!!", res: "error", }]);
        } else {
            const homeworkData = await homework.findOne({ _id: homeworkId })
            return res.status(200)
                .json([{ msg: "Homework updated successflly", data: homeworkData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

const getHomeworkByAcademic = async (req, res) => {
  try {
      const { date, academic } = req.body;
      let allHomework = await homework.find({ academic: academic, dateOfHomework : { $eq : date}}).populate('subject').populate('academic');
      if (
          allHomework !== undefined &&
          allHomework.length !== 0 &&
          allHomework !== null
      ) {
        return res.status(200).send({
          homework: allHomework,
          messge: "All Homework",
          success: true,
        });
      } else {
        return res.status(200).send({
          messge: "Homework does not exist",
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

const getHomeworkByAcademicAndDateRange = async (req, res) => {
  try {
      const { academicYear, studentClass, section, startDate, endDate} = req.body;
      const academicId = await academicsService.getIdIfAcademicExists({academicYear, studentClass, section});
      let allHomework = await homework.find({ academic: academicId, 
        dateOfHomework : { $gte: new Date(startDate), $lte: new Date(endDate) }
      }).populate('subject').populate('academic');
      if (
          allHomework !== undefined &&
          allHomework.length !== 0 &&
          allHomework !== null
      ) {
        return res.status(200).send({
          homework: allHomework,
          messge: "All Homework",
          success: true,
        });
      } else {
        return res.status(200).send({
          messge: "Homework does not exist",
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
module.exports = { create, getAll, remove, update, getHomeworkByAcademic, getHomeworkByAcademicAndDateRange};