const schedule = require('../models/schedule');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');
const academicsService = require('../services/academic');
const studentService = require('../services/students');
const ObjectId = require('mongoose').Types.ObjectId;

const mapActivities = (activities) => {
    let newActivities = [];
    for(let activity of activities) {
        if(isEmpty(activity.time) || isEmpty(activity.subject) || isEmpty(activity.teacher)) {
            continue;
        }
        newActivities.push(activity);
    }
    return newActivities;
}

const add = async (req, res) => {
    try {
        const { day, type, academicYear, studentClass, section, activities } = req.body;
        const scehduleObj = {day : day.toUpperCase(), type};

        if(!isEmpty(academicYear) && !isEmpty(studentClass) && !isEmpty(section)) {
            const academicId = await academicsService.getIdIfAcademicExists({academicYear, studentClass, section});
            if (!ObjectId.isValid(academicId)) {
                return res.status(400)
                    .json([{ msg: "Academic not found.", res: "error", }]);
            }
            scehduleObj['academic'] = academicId
        }
        scehduleObj['activities'] = mapActivities(activities);
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

const update = async (req, res) => {
    try {
        const { scheduleId, day, type, activities } = req.body;
        const updateObj = {};
        updateObj['type'] = isEmpty(type) ? undefined : type;
        updateObj['activities'] = isEmpty(activities) ? undefined : mapActivities(activities);
        const updatedSchedule = await schedule.findOneAndUpdate({ _id: scheduleId, day: day.toUpperCase() },
            {
                $set: updateObj
            });
        return res.status(200).json({
            schedule: updatedSchedule,
            message: "Updated Schedule Successfully",
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
            path: 'activities',
            populate: [{
                "path": 'subject'
            },{
                "path": 'teacher',
                "model": 'Employee'
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
        const scheduleResponse = await schedule.find({ academic: academicId})
        .populate({
            path: 'activities',
            populate: [{
                "path": 'subject'
            },{
                "path": 'teacher',
                "model": 'Employee'
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
        const scheduleResponse = await schedule.findOne({ academic: academicId, day: day.toUpperCase()})
        .populate({
            path: 'activities',
            populate: [{
                "path": 'subject'
            },{
                "path": 'teacher',
                "model": 'Employee'
            }]
          }).exec();
        if (isEmpty(scheduleResponse)) {
            return res.status(400)
                .json([{ msg: "No schedule found for given academics", res: "error", }]);
        }
        return res.status(200).json({
            schedule: scheduleResponse,
            message: "Fetched Schedule by Academics and Day",
            success: true,
        });
    } catch(err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getScheduleDayByStudent = async (req, res) => {
    try {
        const day = req.params['day'];
        const studentId = req.params['studentId'];
        const studentResponse = await studentService.fetchStudentById(studentId);
        if(isEmpty(studentResponse)) {
            return res.status(400)
                .json([{ msg: "No schedule found for given student id", res: "error", }]);
        }
        if (!ObjectId.isValid(studentResponse.academic)) {
            return res.status(400)
                .json([{ msg: "Academic not found.", res: "error", }]);
        }
        const scheduleResponse = await schedule.findOne({ academic: studentResponse.academic, day: day.toUpperCase()})
        .populate({
            path: 'activities',
            populate: [{
                "path": 'subject'
            },{
                "path": 'teacher',
                "model": 'Employee'
            }]
          }).exec();
        if (isEmpty(scheduleResponse)) {
            return res.status(400)
                .json([{ msg: "No schedule found for given academics", res: "error", }]);
        }
        return res.status(200).json({
            schedule: scheduleResponse,
            message: "Fetched Schedule by Academics and Day",
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
        const scheduleResponse = await schedule.find({ "activities.teacher": mongoose.Types.ObjectId(teacher)},{
            day: 1,
            type: 1,
            academic: 1,
            activities: {
                $elemMatch: {
                    teacher: mongoose.Types.ObjectId(teacher),
                },
            }
        })
        .populate({
            path: 'activities',
            populate: [{
                "path": 'subject'
            },{
                "path": 'teacher',
                "model": 'Employee'
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

const getScheduleByAcademicAndTeacher = async (req, res) => {
    try {
        const { teacher, academicYear, studentClass, section } = req.body;
        const academicId = await academicsService.getIdIfAcademicExists({academicYear, studentClass, section});
        if (!ObjectId.isValid(academicId)) {
            return res.status(400)
                .json([{ msg: "Academic not found.", res: "error", }]);
        }
        const scheduleResponse = await schedule.find({ academic: academicId, "activities.teacher": mongoose.Types.ObjectId(teacher)},{
            day: 1,
            type: 1,
            academic: 1,
            activities: {
                $elemMatch: {
                    teacher: mongoose.Types.ObjectId(teacher),
                },
            }
        })
        .populate({
            path: 'activities',
            populate: [{
                "path": 'subject'
            },{
                "path": 'teacher',
                "model": 'Employee'
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

module.exports = { add, getSchedule, getScheduleDayByAcademics, getScheduleByAcademics, getScheduleByTeacher, getScheduleByAcademicAndTeacher, update,
    getScheduleDayByStudent }