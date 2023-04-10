const homeworkSubmission = require('../models/homework-submission');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');
const { uploadAttachment } = require('../utils');


const create = async (req, res) => {
    try {
        const { homework, dateOfSubmission, academic, student } = req.body;
        const file = req.file;
        let attachment = '';
        if(isEmpty(homework) || isEmpty(academic) || isEmpty(student) || isEmpty(file)) {
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
            academic,
            student,
            dateOfSubmission: isEmpty(dateOfSubmission) ? new Date() : dateOfSubmission,
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
module.exports = { create, getAllSubmissionByHomeworkId };