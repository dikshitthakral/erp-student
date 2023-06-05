const classModel = require('../models/class');
const mongoose = require('mongoose');
const { isEmpty, isNumber } = require('lodash');

const create = async (req, res) => {
    try {
        const { className, sections, classNumeric  } = req.body;
        if(isEmpty(className) || isEmpty(sections)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating class.",
                success: false,
            });
        }
        const classData = await classModel.findOne({ sections, classNumeric });
        if(classData) {
            return res.status(400).send({
                messge: "Class already exist.",
                success: false,
            });
        } 
        const newClassModel = await classModel.create({
            className,
            sections,
            classNumeric: isNaN(classNumeric) ? undefined : Number(classNumeric)
        });
        return res.status(200).json({
            class: newClassModel,
            message: "Added New Class Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allClasses = await classModel.find().populate('sections').exec();
        if (
            allClasses !== undefined &&
            allClasses.length !== 0 &&
            allClasses !== null
        ) {
          return res.status(200).send({
            classes: allClasses,
            message: "All Classes",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Classes does not exist",
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
            message: "Class Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteClass = await classModel.deleteOne({ _id: id });
          if (
            deleteClass["deletedCount"] === 0 ||
            deleteClass === null ||
            deleteClass === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Class Not found ",
              success: true,
            });
          } else if (
            deleteClass["deletedCount"] === 1 &&
            deleteClass !== null &&
            deleteClass !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Class Deleted Successfully !!! ",
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
        const { classId, className, sections, classNumeric } = req.body;
        if (isEmpty(classId)) {
            return res.status(400)
                .json([{ msg: "Class not found.", res: "error", }]);
        }
        const updateObject = {}
        updateObject["className"] = !isEmpty(className) ? className : undefined;
        updateObject["classNumeric"] = !isEmpty(classNumeric) ? classNumeric : undefined;
        updateObject["sections"] = !isEmpty(sections) ? sections : undefined;
        let updateClass = await classModel.findOneAndUpdate(
            { _id: classId },
            {
                $set: updateObject
            }
        );
        if (
            updateClass.length === 0 ||
            updateClass === undefined ||
            updateClass === null ||
            updateClass === ""
        ) {
            return res.status(200)
                .json([{ msg: "Class not found!!!", res: "error", }]);
        } else {
            const classData = await classModel.findOne({ _id: classId })
            return res.status(200)
                .json([{ msg: "Class updated successflly", data: classData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}



module.exports = { create, getAll, remove, update };
