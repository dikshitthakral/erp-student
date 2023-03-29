const examTerm = require('../models/examTerm');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const create = async (req, res) => {
    try {
        const { name, branch } = req.body;
        if(isEmpty(name)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating examTerm.",
                success: false,
            });
        }
        const newExamTerm = await examTerm.create({
            name,
            branch
        });
        return res.status(200).json({
            examTerm: newExamTerm,
            message: "Added New ExamTerm Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allExamTerms = await examTerm.find();
        if (
            allExamTerms !== undefined &&
            allExamTerms.length !== 0 &&
            allExamTerms !== null
        ) {
          return res.status(200).send({
            examTerms: allExamTerms,
            messge: "All Exams Terms",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "ExamTerms does not exist",
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
            message: "ExamTerm Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteExamTerm = await examTerm.deleteOne({ _id: id });
          if (
            deleteExamTerm["deletedCount"] === 0 ||
            deleteExamTerm === null ||
            deleteExamTerm === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Exam Term Not found ",
              success: true,
            });
          } else if (
            deleteExamTerm["deletedCount"] === 1 &&
            deleteExamTerm !== null &&
            deleteExamTerm !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Exam Term Deleted Successfully !!! ",
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
        const { examTermId, name, branch } = req.body;
        const updateObject = {}
        if(!isEmpty(name)) { updateObject["name"] = name; }
        if(!isEmpty(branch)) { updateObject["branch"] = branch; }
        let updateExamTerm = await examTerm.findOneAndUpdate(
            { _id: examTermId },
            {
                $set: updateObject
            }
        );
        if (
            updateExamTerm.length === 0 ||
            updateExamTerm === undefined ||
            updateExamTerm === null ||
            updateExamTerm === ""
        ) {
            return res.status(200)
                .json([{ msg: "Exam Term not found!!!", res: "error", }]);
        } else {
            const examTermData = await examTerm.findOne({ _id: examTermId })
            return res.status(200)
                .json([{ msg: "Exam Term updated successflly", data: examTermData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { create, getAll, remove, update};