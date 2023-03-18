const { isEmpty } = require('lodash');
const academics = require("../models/academic");
const ObjectId = require('mongoose').Types.ObjectId;

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

const fetchAcademicsId = async (academicObj) => {
    try {
        let academicId = await getIdIfAcademicExists(academicObj);
        if(!ObjectId.isValid(academicId)) {
            academicId = await createAcademics(academicObj);
        }
        return academicId;
    }catch(err) {
        console.log(err.message);
        throw new Error('Error while fetching/ creating academics id');
    }
}
module.exports = { getIdIfAcademicExists, createAcademics, fetchAcademicsId };