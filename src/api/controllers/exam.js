const exam = require('../models/exam');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const create = async (req, res) => {
    try {
        const { name, description } = req.body;
        if(isEmpty(name)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating exam.",
                success: false,
            });
        }
        const newExam = await exam.create({
            name,
            description
        });
        return res.status(200).json({
            exam: newExam,
            message: "Added New Exam Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allExams = await exam.find();
        if (
            allExams !== undefined &&
            allExams.length !== 0 &&
            allExams !== null
        ) {
          return res.status(200).send({
            exams: allExams,
            messge: "All Exams",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Exams does not exist",
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
            message: "Exam Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteExam = await exam.deleteOne({ _id: id });
          if (
            deleteExam["deletedCount"] === 0 ||
            deleteExam === null ||
            deleteExam === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Exam Not found ",
              success: true,
            });
          } else if (
            deleteExam["deletedCount"] === 1 &&
            deleteExam !== null &&
            deleteExam !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Exam Deleted Successfully !!! ",
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
        const { examId, name, description } = req.body;
        const updateObject = {}
        if(!isEmpty(name)) { updateObject["name"] = name; }
        if(!isEmpty(description)) { updateObject["description"] = description; }
        let updateExam = await exam.findOneAndUpdate(
            { _id: examId },
            {
                $set: updateObject
            }
        );
        if (
            updateExam.length === 0 ||
            updateExam === undefined ||
            updateExam === null ||
            updateExam === ""
        ) {
            return res.status(200)
                .json([{ msg: "Exam not found!!!", res: "error", }]);
        } else {
            const examData = await exam.findOne({ _id: examId })
            return res.status(200)
                .json([{ msg: "Exam updated successflly", data: examData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { create, getAll, remove, update};