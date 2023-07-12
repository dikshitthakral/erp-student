const subject = require('../models/subject');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
          return res.status(200).json({
            message: "Subject Id not found",
            success: false,
          });
        } else if (!isEmpty(id)) {
          const deleteSubject = await subject.deleteOne({ _id: id });
          if (
            deleteSubject["deletedCount"] === 0 ||
            deleteSubject === null ||
            deleteSubject === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Subject Not found ",
              success: true,
            });
          } else if (
            deleteSubject["deletedCount"] === 1 &&
            deleteSubject !== null &&
            deleteSubject !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Subject Deleted Successfully !!! ",
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

const create = async (req, res) => {
    try {
        const { subjectName, subjectCode, subjectAuthor, subjectType } = req.body;
        if(isEmpty(subjectName) || isEmpty(subjectCode) || isEmpty(subjectAuthor) || isEmpty(subjectType)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating subject.",
                success: false,
            });
        }
        const newSubject = await subject.create({
            subjectName,
            subjectCode,
            subjectAuthor,
            subjectType
        });
        return res.status(200).json({
            subject: newSubject,
            message: "Added New Subject Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allSubject = await subject.find();
        if (
            allSubject !== undefined &&
            allSubject.length !== 0 &&
            allSubject !== null
        ) {
          return res.status(200).send({
            subjects: allSubject,
            messge: "All Subjects",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Subjects does not exist",
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

const update = async (req, res) => {
    try {
        const { subjectId, subjectName, subjectCode, subjectAuthor, subjectType } = req.body;
        const subjectResult = await subject.findOne({ _id: mongoose.Types.ObjectId(subjectId)});
        if (isEmpty(subjectResult)) {
            return res.status(400)
                .json([{ msg: "Subject not found.", res: "error", }]);
        }
        const updateObject = {}
        updateObject["subjectName"] = !isEmpty(subjectName) ? subjectName : subjectResult.subjectName;
        updateObject["subjectCode"] = !isEmpty(subjectCode) ? subjectCode : subjectResult.subjectCode;
        updateObject["subjectAuthor"] = !isEmpty(subjectAuthor) ? subjectAuthor : subjectResult.subjectAuthor;
        updateObject["subjectType"] = !isEmpty(subjectType) ? subjectType : subjectResult.subjectType;
        let updateSubject = await subject.findOneAndUpdate(
            { _id: subjectId },
            {
                $set: updateObject
            }
        );
        if (
            updateSubject.length === 0 ||
            updateSubject === undefined ||
            updateSubject === null ||
            updateSubject === ""
        ) {
            return res.status(200)
                .json([{ msg: "Subject not found!!!", res: "error", }]);
        } else {
            const subjectData = await subject.findOne({ _id: subjectId })
            return res.status(200)
                .json([{ msg: "Subject updated successflly", data: subjectData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { remove, create, getAll, update }