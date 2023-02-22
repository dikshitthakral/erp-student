const academicService = require('./academic');
const students = require('../models/students');
const { isEmpty } = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;
const storage = require('./storage');
const util = require("util");
const fs = require("fs");

const documents = ['image', 'idCardDocument', 'guardian.image', 'guardian.idProofDocument'];
const fetchAcademicsId = async (academicObj) => {
    try {
        let academicId = await academicService.getIdIfAcademicExists(academicObj);
        if(!ObjectId.isValid(academicId)) {
            academicId = await academicService.createAcademics(academicObj);
        }
        return academicId;
    }catch(err) {
        console.log(err.message);
        throw new Error('Error while fetching/ creating academics id');
    }
}

const fetchUpdatedAcademicsId = async (academicObj, studentRecord) => {
    try {
        if(isEmpty(academicObj.academicYear) && isEmpty(academicObj.studentClass) && isEmpty(academicObj.section)) {
            return studentRecord.academic._id;
        }
        if(academicObj.academicYear === studentRecord.academic.academicYear &&
            academicObj.studentClass === studentRecord.academic.studentClass &&
            academicObj.section === studentRecord.academic.section) {
                return studentRecord.academic._id;
        }
        let academicId = await academicService.getIdIfAcademicExists(academicObj);
        if(!ObjectId.isValid(academicId)) {
            academicId = await academicService.createAcademics(academicObj);
        }
        return academicId;
    }catch(err) {
        console.log(err.message);
        throw new Error('Error while fetching/ creating academics id');
    }
}

const add = async (studentObj, body) => {
    const { lastName, gender, bloodGroup, motherTongue, religion, caste, city, state, presentAddress, permanentAddress,
        previousSchoolName, previousQualification, previousRemarks, transportRoute, vehicleNo} = body;

    if(!isEmpty(lastName)) { studentObj["lastName"] = lastName};
    if(!isEmpty(gender)) { studentObj["gender"] = gender};
    if(!isEmpty(bloodGroup)) { studentObj["bloodGroup"] = bloodGroup};
    if(!isEmpty(motherTongue)) { studentObj["motherTongue"] = motherTongue};
    if(!isEmpty(religion)) { studentObj["religion"] = religion};
    if(!isEmpty(caste)) { studentObj["caste"] = caste};
    if(!isEmpty(city)) { studentObj["city"] = city};
    if(!isEmpty(state)) { studentObj["state"] = state};
    if(!isEmpty(presentAddress)) { studentObj["presentAddress"] = presentAddress};
    if(!isEmpty(permanentAddress)) { studentObj["permanentAddress"] = permanentAddress};
    if(!isEmpty(previousSchoolName)) { studentObj["previousSchoolName"] = previousSchoolName};
    if(!isEmpty(previousQualification)) { studentObj["previousQualification"] = previousQualification};
    if(!isEmpty(previousRemarks)) { studentObj["previousRemarks"] = previousRemarks};
    if(!isEmpty(transportRoute)) { studentObj["transportRoute"] = transportRoute};
    if(!isEmpty(vehicleNo)) { studentObj["vehicleNo"] = vehicleNo};
    
    return students.create(studentObj);
}

const uploadDocuments = async (files) => {
    const uploadedLocations = {};
    const unlinkFile = util.promisify(fs.unlink);
    for(let document of documents) {
        const file = files[document] ? files[document][0] : undefined;
        if(isEmpty(file)) { continue; }
        const location = await storage.uploadFile(file);
        // Deleting from local if uploaded in S3 bucket
        await unlinkFile(file.path);
        if(document.includes('guardian')) {
            const keys = document.split('.');
            if(!uploadedLocations[keys[0]]) { uploadedLocations[keys[0]] = {}};
            uploadedLocations[keys[0]][keys[1]] = location;
        } else {
            uploadedLocations[document] = location;
        }
    }
    return uploadedLocations;
}

module.exports = { fetchAcademicsId, add, uploadDocuments, fetchUpdatedAcademicsId };