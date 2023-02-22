const { isEmpty } = require('lodash');
const mongoose = require('mongoose');
const academics = require("../models/academic");

const getIdIfAcademicExists = async (academicObj) => {
    const academicsRes = await academics.findOne({ 
        academicYear: academicObj.academicYear, 
        studentClass: academicObj.studentClass, 
        section: academicObj.section
    });
    if(isEmpty(academicsRes)) {
        return null;
    }
    return academicsRes._id;
};

const createAcademics = async (academicObj) => {
    try {
        let newAcademicsRes = await academics.create(academicObj);
        return newAcademicsRes._id;
    } catch(err) {
        console.log(`${err}`);
        throw new Error('Error while creating academics');
    }
};

module.exports = { getIdIfAcademicExists, createAcademics };