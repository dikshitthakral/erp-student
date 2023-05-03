const marks = require('../models/marks');
const grades = require('../models/grade');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');
const academicsService = require('../services/academic');

const create = async (req, res) => {
    try {
        const { examId, subject, studentId, isAbsent, practical, written, academicYear, studentClass, section,
          totalPractical, totalWritten } = req.body;
        if(isEmpty(studentId) || isEmpty(subject) || isEmpty(examId) || isEmpty(academicYear) || isEmpty(studentClass) || isEmpty(section)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating Marks.",
                success: false,
            });
        }
        const academicId = await academicsService.fetchAcademicsId({ academicYear, studentClass, section });
        const newMarks = await marks.create({
            examId,
            subject,
            student: studentId,
            isAbsent : isEmpty(isAbsent) ? undefined : isAbsent,
            practical : (practical === null || practical === '' || practical === undefined) ? 0 : practical,
            written : (written === null || written === '' || written === undefined)  ? 0 : written,
            academic: academicId,
            totalPractical: isNaN(totalPractical) ? 30 : totalPractical,
            totalWritten: isNaN(totalWritten) ? 70 : totalWritten,
            totalMarksScored: practical + written
        });
        return res.status(200).json({
            marks: newMarks,
            message: "Added New Marks Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allMarks = await marks.find();
        if (
            allMarks !== undefined &&
            allMarks.length !== 0 &&
            allMarks !== null
        ) {
          return res.status(200).send({
            marks: allMarks,
            messge: "All Marks",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Marks does not exist",
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

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
          return res.status(200).json({
            message: "Marks Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteMarks = await marks.deleteOne({ _id: id });
          if (
            deleteMarks["deletedCount"] === 0 ||
            deleteMarks === null ||
            deleteMarks === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Marks Not found ",
              success: true,
            });
          } else if (
            deleteMarks["deletedCount"] === 1 &&
            deleteMarks !== null &&
            deleteMarks !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Marks Deleted Successfully !!! ",
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
        const { marksId, examId, subject, studentId, isAbsent, practical, written, academicYear, studentClass, section,
          totalPractical, totalWritten } = req.body;
        const updateObject = {}
        if(!isEmpty(examId)) { updateObject["examId"] = examId; }
        if(!isEmpty(subject)) { updateObject["subject"] = subject; }
        if(!isEmpty(studentId)) { updateObject["student"] = studentId; }
        if(!isEmpty(isAbsent)) { updateObject["isAbsent"] = isAbsent; }
        if(practical !== null && practical !== '' && practical !== undefined) { updateObject["practical"] = Number(practical); }
        if(written !== null && written !== '' && written !== undefined) { updateObject["written"] = Number(written); }
        if(totalPractical !== null && totalPractical !== '' && totalPractical !== undefined) { updateObject["totalPractical"] = Number(totalPractical); }
        if(totalWritten !== null && totalWritten !== '' && totalWritten !== undefined) { updateObject["totalWritten"] = Number(totalWritten); }
        if(!isNaN(practical) && !isNaN(written)) { updateObject["totalMarksScored"] = Number(practical) + Number(written); }
        if(!isEmpty(academicYear) && !isEmpty(studentClass) && !isEmpty(section)) {
          const academicId = await academicsService.fetchAcademicsId({ academicYear, studentClass, section });
          updateObject["academic"] = academicId;
        }
        let updateMarks = await marks.findOneAndUpdate(
            { _id: marksId },
            {
                $set: updateObject
            }
        );
        if (
            updateMarks.length === 0 ||
            updateMarks === undefined ||
            updateMarks === null ||
            updateMarks === ""
        ) {
            return res.status(200)
                .json([{ msg: "Marks not found!!!", res: "error", }]);
        } else {
            const marksData = await marks.findOne({ _id: marksId })
            return res.status(200)
                .json([{ msg: "Marks updated successflly", data: marksData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

const getMarksByAcademicAndStudentId = async (req, res) => {
  try {
      const { studentId, academic } = req.body;

      let allMarksByStudentAndAcademic = await marks.find({student : studentId, academic}).populate('examId').populate('subject');
      if (
        allMarksByStudentAndAcademic !== undefined &&
        allMarksByStudentAndAcademic.length !== 0 &&
        allMarksByStudentAndAcademic !== null
      ) {
        let academicMarks = new Map();
        const allGrades = await grades.find({});
        for(let mark of allMarksByStudentAndAcademic) {
            let percentage = ((mark._doc.practical + mark._doc.written) * 100)/ (mark._doc.totalPractical + mark._doc.totalWritten);
            const resultGrade = allGrades.find(grade => {
              let docGrade = grade._doc;
              if(percentage >= docGrade.minPercentage && percentage <= docGrade.maxPercentage) {
                return true;
              }
            })
            let updatedMarks = {
              ...mark._doc,
              totalMarksScored: mark._doc.practical + mark._doc.written,
              percentage : percentage,
              grade: resultGrade._doc.name,
              point: resultGrade._doc.gradePoint
            }
            if(academicMarks.has(mark.examId.name)) {
              let examMarks = academicMarks.get(mark.examId.name);
              examMarks.push(updatedMarks)
              academicMarks.set(mark.examId.name, examMarks);
            }
            else {
              let examMarks = [];
              examMarks.push(updatedMarks);
              academicMarks.set(mark.examId.name, examMarks);
            }
        }
        return res.status(200).send({
          marks: Object.fromEntries(academicMarks),
          messge: "All Marks",
          success: true,
        });
      } else {
        return res.status(200).send({
          messge: "Marks does not exist",
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

module.exports = { create, getAll, remove, update, getMarksByAcademicAndStudentId };