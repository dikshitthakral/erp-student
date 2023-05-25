const academics = require('../models/academic');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');
const academicsService = require('../services/academic');
const ObjectId = require('mongoose').Types.ObjectId;
const classService = require('../services/class');
const sectionService = require('../services/section');

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
          return res.status(200).json({
            message: "Academic Id not found",
            success: false,
          });
        } else if (!isEmpty(id)) {
          const deleteAcademic = await academics.deleteOne({ _id: id });
          if (
            deleteAcademic["deletedCount"] === 0 ||
            deleteAcademic === null ||
            deleteAcademic === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Academic Not found ",
              success: true,
            });
          } else if (
            deleteAcademic["deletedCount"] === 1 &&
            deleteAcademic !== null &&
            deleteAcademic !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Academic Deleted Successfully !!! ",
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
        const { academicYear, studentClass, section, classNumeric, name } = req.body;
        if(isEmpty(academicYear) || isEmpty(studentClass) || isEmpty(section)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating academic.",
                success: false,
            });
        }
        const newAcademic = await academics.create({
            academicYear,
            studentClass,
            section,
            name:  isEmpty(name) ? undefined : name,
            classNumeric:  isNaN(classNumeric) ? undefined : Number(classNumeric)
        });
        return res.status(200).json({
            academic: newAcademic,
            message: "Added New Academic Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allAcademics = await academics.find().populate('subjects').populate('teachers');
        if (
            allAcademics !== undefined &&
            allAcademics.length !== 0 &&
            allAcademics !== null
        ) {
          return res.status(200).send({
            academics: allAcademics,
            messge: "All Academics",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Academics does not exist",
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
      let academicsById = await academics.findOne({ _id: id}).populate('subjects').populate('teachers');
      if (
          academicsById !== undefined &&
          academicsById.length !== 0 &&
          academicsById !== null
      ) {
        return res.status(200).send({
          academics: academicsById,
          messge: "Academics By Id",
          success: true,
        });
      } else {
        return res.status(200).send({
          messge: "Academics does not exist",
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

const getByAcademicDetails = async (req, res) => {
  try {
      const { academicYear, studentClass, section } = req.body;
      const classResponse = await classService.getById(studentClass);
      const sectionResponse = await sectionService.getById(section);
      let academicsByDetails = await academics.findOne({ academicYear, studentClass, section }).populate('subjects').populate('teachers');
      if (
        academicsByDetails !== undefined &&
        academicsByDetails.length !== 0 &&
        academicsByDetails !== null
      ) {
        return res.status(200).send({
          academics: { ...academicsByDetails._doc,
                    class: classResponse && classResponse.className,
                    section: sectionResponse && sectionResponse.name },
          messge: "Academics By details",
          success: true,
        });
      } else {
        return res.status(200).send({
          messge: "Academics does not exist",
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
        const { academicId, academicYear, studentClass, section, classNumeric, name } = req.body;
        const academicsResult = await academics.findOne({ _id: mongoose.Types.ObjectId(academicId)});
        if (isEmpty(academicsResult)) {
            return res.status(400)
                .json([{ msg: "Academic not found.", res: "error", }]);
        }
        const updateObject = {}
        updateObject["academicYear"] = !isEmpty(academicYear) ? academicYear : academicsResult.academicYear;
        updateObject["studentClass"] = !isEmpty(studentClass) ? studentClass : academicsResult.studentClass;
        updateObject["section"] = !isEmpty(section) ? section : academicsResult.section;
        if(!isNaN(classNumeric)) { updateObject["classNumeric"] = Number(classNumeric) }
        if(!isEmpty(name)) { updateObject["name"] = name }
        let updateAcademic = await academics.findOneAndUpdate(
            { _id: id },
            {
                $set: updateObject
            }
        );
        if (
            updateAcademic.length === 0 ||
            updateAcademic === undefined ||
            updateAcademic === null ||
            updateAcademic === ""
        ) {
            return res.status(200)
                .json([{ msg: "Academic not found!!!", res: "error", }]);
        } else {
            const academicsData = await academics.findOne({ _id: id })
            return res.status(200)
                .json([{ msg: "Academics updated successflly", data: academicsData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

const addSubject = async (req, res) => {
    try {
        const { academicYear, studentClass, section, subjects } = req.body;
        const academicsExist = await academics.findOne({ 
          academicYear: academicYear, 
          studentClass: ObjectId(studentClass), 
          section: ObjectId(section)
        });
        if (academicsExist && !ObjectId.isValid(academicsExist._id)) {
            return res.status(400)
                .json([{ msg: "Academic not found.", res: "error", }]);
        }
        let uploadedSubjects = [];
        for(let newSubject of subjects) {
            if(!academicsExist.subjects.find((element) => element.toString() === newSubject.toString())) {
              uploadedSubjects.push(newSubject)
            }
        }
        let updateAcademic = await academics.findOneAndUpdate(
            { _id: academicsExist._id },
            { $push: { subjects: uploadedSubjects } }
        );
        if (
            updateAcademic === undefined ||
            updateAcademic === null ||
            updateAcademic === ""
        ) {
            return res.status(200)
                .json([{ msg: "Update Subject in Academic.", res: "error", }]);
        } else {
            const academicsData = await academics.findOne({ _id: academicsExist._id }).populate('subjects');
            return res.status(200)
                .json([{ msg: "Subjects in Academics updated successflly", data: academicsData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

const removeSubject = async (req, res) => {
    try {
        const { academicYear, studentClass, section, subject } = req.body;
        const academicId = await academicsService.getIdIfAcademicExists({academicYear, studentClass, section});
        if (!ObjectId.isValid(academicId)) {
            return res.status(400)
                .json([{ msg: "Academic not found.", res: "error", }]);
        }
        let updateAcademic = await academics.findOneAndUpdate(
            { _id: academicId },
            { $pull: { subjects: subject } }
        );
        if (
            updateAcademic.length === 0 ||
            updateAcademic === undefined ||
            updateAcademic === null ||
            updateAcademic === ""
        ) {
            return res.status(200)
                .json([{ msg: "Update Subject in Academic.", res: "error", }]);
        } else {
            const academicsData = await academics.findOne({ _id: id }).populate('subjects');
            return res.status(200)
                .json([{ msg: "Subject in Academics updated successflly", data: academicsData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

const addTeacher = async (req, res) => {
  try {
      const { academicYear, studentClass, section, teachers } = req.body;
      const academicsExist = await academics.findOne({ 
        academicYear: academicYear, 
        studentClass: ObjectId(studentClass), 
        section: ObjectId(section)
      });
      if (academicsExist && !ObjectId.isValid(academicsExist._id)) {
          return res.status(400)
              .json([{ msg: "Academic not found.", res: "error", }]);
      }
      let uploadedTeachers = [];
      for(let newTeacher of teachers) {
          if(!academicsExist.teachers.find((element) => element.toString() === newTeacher.toString())) {
            uploadedTeachers.push(newTeacher)
          }
      }
      let updateAcademic = await academics.findOneAndUpdate(
          { _id: academicsExist._id },
          { $push: { teachers: uploadedTeachers } }
      );
      if (
          updateAcademic === undefined ||
          updateAcademic === null ||
          updateAcademic === ""
      ) {
          return res.status(200)
              .json([{ msg: "Update Teacher in Academic.", res: "error", }]);
      } else {
          const academicsData = await academics.findOne({ _id: academicsExist._id }).populate('teachers');
          return res.status(200)
              .json([{ msg: "Teachers in Academics updated successflly", data: academicsData, res: "success" }]);
      }
  } catch (error) {
      return res.status(400).send({
        messge: "Somethig went wrong",
        success: false,
      });
    }
}

const removeTeacher = async (req, res) => {
  try {
      const { academicYear, studentClass, section, teacher } = req.body;
      const academicId = await academicsService.getIdIfAcademicExists({academicYear, studentClass, section});
      if (!ObjectId.isValid(academicId)) {
          return res.status(400)
              .json([{ msg: "Academic not found.", res: "error", }]);
      }
      let updateAcademic = await academics.findOneAndUpdate(
          { _id: academicId },
          { $pull: { teachers: teacher } }
      );
      if (
          updateAcademic.length === 0 ||
          updateAcademic === undefined ||
          updateAcademic === null ||
          updateAcademic === ""
      ) {
          return res.status(200)
              .json([{ msg: "Update Teacher in Academic.", res: "error", }]);
      } else {
          const academicsData = await academics.findOne({ _id: id }).populate('teachers');
          return res.status(200)
              .json([{ msg: "Teacher in Academics updated successflly", data: academicsData, res: "success" }]);
      }
  } catch (error) {
      return res.status(400).send({
        messge: "Somethig went wrong",
        success: false,
      });
    }
}

module.exports = { remove, create, getAll, update, addSubject, removeSubject, addTeacher, removeTeacher, getById, getByAcademicDetails }