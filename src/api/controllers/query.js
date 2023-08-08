const query = require('../models/query');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');
const { uploadAttachment } = require('../utils');

const addQuestion = async (req, res) => {
    try {
        const { question, student, employee } = req.body;
        if(isEmpty(question) || isEmpty(student) || isEmpty(employee)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating query.",
                success: false,
            });
        }
        const file = req.file;
        let attachment = '';
        if(!isEmpty(file)) {
            attachment = await uploadAttachment(file);
        }
        let queryObj = {
            question,
            student,
            employee,
            questionAttachment: attachment
        }
        const newQuery = await query.create(queryObj);
        return res.status(200).json({
            query: newQuery,
            message: "Added New Query Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const updateAnswer = async (req, res) => {
    try {
        const { queryId, answer } = req.body;
        if(isEmpty(queryId) || isEmpty(answer)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating query.",
                success: false,
            });
        }
        const file = req.file;
        let attachment = '';
        if(!isEmpty(file)) {
            attachment = await uploadAttachment(file);
        }
        let updateObject = {
            answer,
            answerAttachment: attachment
        }
        let updateQuery = await query.findOneAndUpdate(
            { _id: queryId },
            {
                $set: updateObject
            }
        );
        if (
            updateQuery === undefined ||
            updateQuery === null ||
            updateQuery === ""
        ) {
            return res.status(200)
                .json([{ msg: "Query not found!!!", res: "error", }]);
        } else {
            const queryData = await query.findOne({ _id: queryId })
            return res.status(200)
                .json([{ msg: "Query updated successflly", data: queryData, res: "success" }]);
        }
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allQueries = await query.find().populate('employee').populate('student');
        if (
            allQueries !== undefined &&
            allQueries.length !== 0 &&
            allQueries !== null
        ) {
          return res.status(200).send({
            queries: allQueries,
            messge: "All Queries",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Queries does not exist",
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

const getById = async (req, res) => {
  try {
      const id = req.params['id'];
      let queryById = await query.findOne({ _id: id}).populate('employee').populate('student');
      if (
        queryById !== undefined &&
        queryById.length !== 0 &&
        queryById !== null
      ) {
        return res.status(200).send({
          query: queryById,
          messge: "Query By Id",
          success: true,
        });
      } else {
        return res.status(200).send({
          messge: "Query does not exist",
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

const getByTeacher = async (req, res) => {
    try {
        const teacherId = req.params['teacherId'];
        let queriesByTeacher = await query.find({ employee: teacherId}).populate('employee').populate('student');
        if (queriesByTeacher.length >= 1) {
          return res.status(200).send({
            queries: queriesByTeacher,
            messge: "Query By Teacher",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Query does not exist",
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

const getQueriesByStudent = async (req, res) => {
    try {
        const studentId = req.params['studentId'];
        let queriesByStudent = await query.find({ student: studentId}).populate('employee').populate('student');
        if (
            queriesByStudent !== undefined &&
            queriesByStudent.length !== 0 &&
            queriesByStudent !== null
        ) {
          return res.status(200).send({
            queries: queriesByStudent,
            messge: "Query By Student",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Query does not exist",
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


module.exports = { addQuestion, updateAnswer, getAll, getById, getByTeacher, getQueriesByStudent };
