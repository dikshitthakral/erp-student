const grade = require('../models/grade');
const mongoose = require('mongoose');
const { isEmpty, isNumber } = require('lodash');

const create = async (req, res) => {
    try {
        const { name, gradePoint, minPercentage, maxPercentage, remarks } = req.body;
        if(isEmpty(name) || isEmpty(gradePoint) || !isNumber(Number(minPercentage)) || !isNumber(Number(maxPercentage))) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating grades.",
                success: false,
            });
        }
        const newGrade = await grade.create({
            name,
            gradePoint,
            minPercentage : Number(minPercentage),
            maxPercentage: Number(maxPercentage),
            remarks:  isEmpty(remarks) ? undefined : remarks
        });
        return res.status(200).json({
            grade: newGrade,
            message: "Added New Grade Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allGrades = await grade.find();
        if (
            allGrades !== undefined &&
            allGrades.length !== 0 &&
            allGrades !== null
        ) {
          return res.status(200).send({
            grades: allGrades,
            messge: "All Grades",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Grades does not exist",
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
            message: "Grade Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteGrade = await grade.deleteOne({ _id: id });
          if (
            deleteGrade["deletedCount"] === 0 ||
            deleteGrade === null ||
            deleteGrade === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Grade Not found ",
              success: true,
            });
          } else if (
            deleteGrade["deletedCount"] === 1 &&
            deleteGrade !== null &&
            deleteGrade !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Grade Deleted Successfully !!! ",
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
        const { gradeId, name, gradePoint, minPercentage, maxPercentage, remarks } = req.body;
        const gradeResult = await grade.findOne({ _id: mongoose.Types.ObjectId(gradeId)});
        if (isEmpty(gradeResult)) {
            return res.status(400)
                .json([{ msg: "Grade not found.", res: "error", }]);
        }
        const updateObject = {}
        updateObject["name"] = !isEmpty(name) ? name : gradeResult.name;
        updateObject["gradePoint"] = !isEmpty(gradePoint) ? gradePoint : gradeResult.gradePoint;
        updateObject["minPercentage"] = !isEmpty(minPercentage) ? minPercentage : gradeResult.minPercentage;
        updateObject["maxPercentage"] = !isEmpty(maxPercentage) ? maxPercentage : gradeResult.maxPercentage;
        updateObject["remarks"] = !isEmpty(remarks) ? remarks : gradeResult.remarks;
        let updateGrade = await grade.findOneAndUpdate(
            { _id: gradeId },
            {
                $set: updateObject
            }
        );
        if (
            updateGrade.length === 0 ||
            updateGrade === undefined ||
            updateGrade === null ||
            updateGrade === ""
        ) {
            return res.status(200)
                .json([{ msg: "Grade not found!!!", res: "error", }]);
        } else {
            const gradeData = await grade.findOne({ _id: gradeId })
            return res.status(200)
                .json([{ msg: "Grade updated successflly", data: gradeData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { create, getAll, remove, update};
