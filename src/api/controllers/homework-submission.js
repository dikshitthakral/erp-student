const homeworkSubmission = require('../models/homework-submission');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');
const { uploadAttachment } = require('../utils');
const academicsService = require('../services/academic');
const ObjectId = require('mongoose').Types.ObjectId;
const classService = require('../services/class');
const sectionService = require('../services/section');

const create = async (req, res) => {
    try {
        const { homework, dateOfSubmission, academicYear, studentClass, section, student } = req.body;
        const file = req.file;
        let attachment = '';
        const academicId = await academicsService.getIdIfAcademicExists({academicYear, studentClass, section});
        if(isEmpty(homework) || !ObjectId.isValid(academicId) || isEmpty(student)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating Submissing Homework.",
                success: false,
            });
        }
        if(!isEmpty(file)) {
            attachment = await uploadAttachment(file);
        }
        const newHomeWorkSubmission = await homeworkSubmission.create({
            homework,
            academic: academicId,
            student,
            dateOfSubmission: isEmpty(dateOfSubmission) ? new Date() : (dateOfSubmission.includes('T') ? dateOfSubmission.split('T')[0] : dateOfSubmission),
            attachment: isEmpty(attachment) ? undefined : attachment
        });
        return res.status(200).json({
            hoemworkSubmission: newHomeWorkSubmission,
            message: "Added New Homework submissions Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAllSubmissionByHomeworkId = async (req, res) => {
    try {
        const homeworkId = req.params['homeworkId'];
        let allSubmissions = await homeworkSubmission.find({ homework: homeworkId }).populate('homework').populate('student').exec();
        if (
            allSubmissions !== undefined &&
            allSubmissions.length !== 0 &&
            allSubmissions !== null
        ) {
          return res.status(200).send({
            submission: allSubmissions,
            messge: "All Submissions",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Submissions does not exist",
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

const getHomeworkSubmissionByFilter = async (req, res) => {
  try {
      const { academicYear, studentClass, section, startDate, endDate, subject} = req.body;
      const academicId = await academicsService.getIdIfAcademicExists({academicYear, studentClass, section});
      let allHomeworkSubmission = await homeworkSubmission.find({ academic: academicId, 
        dateOfSubmission : { $gte: new Date(startDate), $lte: new Date(endDate) }
      }).populate('student').populate({
        path: 'homework',
        populate: [{ path: 'subject', model: 'Subject'}]
      });
      const classResponse = await classService.getById(studentClass);
      const sectionResponse = await sectionService.getById(section);
      if (
        allHomeworkSubmission !== undefined &&
        allHomeworkSubmission.length !== 0 &&
        allHomeworkSubmission !== null
      ) {
        let updatedSubmission = [];
        for(let submission of allHomeworkSubmission) {
          if(submission._doc.homework.subject._id.toString() === subject) {
            updatedSubmission.push({
              ...submission._doc,
              class: classResponse && classResponse.className,
              section: sectionResponse && sectionResponse.name
            });
          }
        }
        return res.status(200).send({
          homeworkSubmission: updatedSubmission,
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
module.exports = { create, getAllSubmissionByHomeworkId, getHomeworkSubmissionByFilter };