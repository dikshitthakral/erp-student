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
        let queriesByTeacher = await query.find({ employee: teacherId}).populate('employee').populate('student')
        .sort({
          createdAt: 'asc'
        });
        if (queriesByTeacher.length >= 1) {
          let queriesMap = new Map();
          for(let query of queriesByTeacher) {
            // if(!queriesMap.has(query.student.firstName + ' ' + query.student.lastName)) {
            //   queriesMap.set(query.student.firstName + ' ' + query.student.lastName, [query])
            // } else {
            //   let queriesArr = queriesMap.get(query.student.firstName + ' ' + query.student.lastName);
            //   queriesMap.set(query.student.firstName + ' ' + query.student.lastName, [...queriesArr, query])
            // }
            if(!queriesMap.has(query.student._id)) {
              queriesMap.set(query.student._id, {
                studentId: query.student._id,
                studentName: query.student.firstName + ' ' + query.student.lastName,
                studentEmail: query.student.email
              })
            }
          }
          return res.status(200).send({
            queries: [...queriesMap.values()],
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
        let queriesByStudent = await query.find({ student: studentId}).populate('employee').populate('student')
        .sort({
          createdAt: 'asc'
        });
        if (
            queriesByStudent !== undefined &&
            queriesByStudent.length !== 0 &&
            queriesByStudent !== null
        ) {
          let queriesMap = new Map();
          for(let query of queriesByStudent) {
            // if(!queriesMap.has(query.employee.name + ' ' + query.employee.email)) {
            //   queriesMap.set(query.employee.name + ' ' + query.employee.email, [query])
            // } else {
            //   let queriesArr = queriesMap.get(query.employee.name + ' ' + query.employee.email);
            //   queriesMap.set(query.employee.name + ' ' + query.employee.email, [...queriesArr, query])
            // }
            if(!queriesMap.has(query.employee._id)) {
              queriesMap.set(query.employee._id, {
                employeeId: query.employee._id,
                employeeName: query.employee.name,
                employeeEmail: query.employee.email
              })
            }
          }
          return res.status(200).send({
            queries: [...queriesMap.values()],
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

const getByTeacherAndStudent = async (req, res) => {
  try {
    const teacherId = req.params['teacherId'];
    const studentId = req.params['studentId'];
    let queriesByTeacherAndStudent = await query.find({ employee: teacherId, student: studentId }).populate('employee').populate('student')
    .sort({
      createdAt: 'asc'
    });
    if (
      queriesByTeacherAndStudent !== undefined &&
      queriesByTeacherAndStudent.length !== 0 &&
      queriesByTeacherAndStudent !== null
  ) { 
    return res.status(200).send({
      queries: queriesByTeacherAndStudent,
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

module.exports = { addQuestion, updateAnswer, getAll, getById, getByTeacher, getQueriesByStudent, getByTeacherAndStudent };
