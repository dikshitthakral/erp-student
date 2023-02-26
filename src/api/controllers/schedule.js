const schedule = require('../models/schedule');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');
const academicsService = require('../services/academic');
const ObjectId = require('mongoose').Types.ObjectId;

const add = async (req, res) => {
    try {
        const { days, type, academicYear, studentClass, section, teacher, name} = req.body;
        const scehduleObj = {days, type, name};

        if(!isEmpty(academicYear) && !isEmpty(studentClass) && !isEmpty(section)) {
            const academicId = await academicsService.getIdIfAcademicExists({academicYear, studentClass, section});
            if (!ObjectId.isValid(academicId)) {
                return res.status(400)
                    .json([{ msg: "Academic not found.", res: "error", }]);
            }
            scehduleObj['academic'] = academicId
        }
        if(!isEmpty(teacher)) {
            scehduleObj['teacher'] = teacher
        }
        const newSchedule = await schedule.create(scehduleObj);
        return res.status(200).json({
            schedule: newSchedule,
            message: "Added New Schedule Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getSchedule = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
            return res.status(200).json({
              message: "Schedule Id not found",
              success: false,
            });
        }
        const scheduleResult = await schedule.findOne({ _id: mongoose.Types.ObjectId(id)})
        .populate({
            path: 'days',
            populate: [{
                path: 'activity',
                populate: [{
                    "path": 'subject'
                },{
                    "path": 'teacher',
                    "model": 'Employee'
                }]
            }]
          }).exec();
        if (isEmpty(scheduleResult)) {
            return res.status(400)
                .json([{ msg: "Schedule not found.", res: "error", }]);
        }
        return res.status(200).json({
            schedule: scheduleResult,
            message: "Fetched Schedule by Id",
            success: true,
        });
    } catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getScheduleByAcademics = async (req, res) => {
    try {
        const { academicYear, studentClass, section} = req.body;
        const academicId = await academicsService.getIdIfAcademicExists({academicYear, studentClass, section});
        if (!ObjectId.isValid(academicId)) {
            return res.status(400)
                .json([{ msg: "Academic not found.", res: "error", }]);
        }
        const scheduleResponse = await schedule.findOne({ academic: academicId})
        .populate({
            path: 'days',
            populate: [{
                path: 'activity',
                populate: [{
                    "path": 'subject'
                },{
                    "path": 'teacher',
                    "model": 'Employee'
                }]
            }]
          }).exec();
        if (isEmpty(schedule)) {
            return res.status(400)
                .json([{ msg: "No schedule found for given academics", res: "error", }]);
        }
        return res.status(200).json({
            schedule: scheduleResponse,
            message: "Fetched Schedule by Academics",
            success: true,
        });
    } catch(err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getScheduleDayByAcademics = async (req, res) => {
    try {
        const { academicYear, studentClass, section} = req.body;
        const day = req.params['day'];
        const academicId = await academicsService.getIdIfAcademicExists({academicYear, studentClass, section});
        if (!ObjectId.isValid(academicId)) {
            return res.status(400)
                .json([{ msg: "Academic not found.", res: "error", }]);
        }
        const scheduleResponse = await schedule.findOne({ academic: academicId})
        .populate({
            path: 'days',
            populate: [{
                path: 'activity',
                populate: [{
                    "path": 'subject'
                },{
                    "path": 'teacher',
                    "model": 'Employee'
                }]
            }]
          }).exec();
        const filteredResponse = scheduleResponse.days.filter(value => value.day.toUpperCase() === day.toUpperCase())
        if (isEmpty(schedule)) {
            return res.status(400)
                .json([{ msg: "No schedule found for given academics", res: "error", }]);
        }
        return res.status(200).json({
            schedule: filteredResponse,
            message: "Fetched Schedule by Academics",
            success: true,
        });
    } catch(err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getScheduleByTeacher = async (req, res) => {
    try {
        const { teacher} = req.body;
        const scheduleResponse = await schedule.findOne({ teacher: mongoose.Types.ObjectId(teacher)})
        .populate({
            path: 'days',
            populate: [{
                path: 'activity',
                populate: [{
                    "path": 'subject'
                },{
                    "path": 'teacher',
                    "model": 'Employee'
                }]
            }]
          }).exec();
        if (isEmpty(schedule)) {
            return res.status(400)
                .json([{ msg: "No schedule found for given academics", res: "error", }]);
        }
        return res.status(200).json({
            schedule: scheduleResponse,
            message: "Fetched Schedule by Academics",
            success: true,
        });
    } catch(err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

module.exports = { add, getSchedule, getScheduleDayByAcademics, getScheduleByAcademics, getScheduleByTeacher }