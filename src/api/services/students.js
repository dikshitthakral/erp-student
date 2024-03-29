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
    const { lastName, gender, bloodGroup, motherTongue, religion, caste, presentAddressHouseNo, presentAddressStreet, 
        presentAddressZipCode, presentAddressCity, presentAddressState, premanentAddressHouseNo, premanentAddressStreet, premanentAddressZipCode,
        premanentAddressCity, premanentAddressState, previousSchoolName, previousQualification, previousRemarks, 
        vehicleNo, vehicleRoute, type, category, rollNo, permanentEducationNumber} = body;

    if(!isEmpty(category)) { studentObj["category"] = category};
    if(!isEmpty(rollNo)) { studentObj["rollNo"] = rollNo};
    if(!isEmpty(lastName)) { studentObj["lastName"] = lastName};
    if(!isEmpty(gender)) { studentObj["gender"] = gender};
    if(!isEmpty(bloodGroup)) { studentObj["bloodGroup"] = bloodGroup};
    if(!isEmpty(motherTongue)) { studentObj["motherTongue"] = motherTongue};
    if(!isEmpty(religion)) { studentObj["religion"] = religion};
    if(!isEmpty(caste)) { studentObj["caste"] = caste};
    if(!isEmpty(type)) { studentObj["type"] = type};
    if(!isEmpty(presentAddressHouseNo)) { studentObj["presentAddressHouseNo"] = presentAddressHouseNo};
    if(!isEmpty(presentAddressStreet)) { studentObj["presentAddressStreet"] = presentAddressStreet};
    if(!isEmpty(presentAddressZipCode)) { studentObj["presentAddressZipCode"] = presentAddressZipCode};
    if(!isEmpty(presentAddressCity)) { studentObj["presentAddressCity"] = presentAddressCity};
    if(!isEmpty(presentAddressState)) { studentObj["presentAddressState"] = presentAddressState};
    if(!isEmpty(premanentAddressHouseNo)) { studentObj["premanentAddressHouseNo"] = premanentAddressHouseNo};
    if(!isEmpty(premanentAddressStreet)) { studentObj["premanentAddressStreet"] = premanentAddressStreet};
    if(!isEmpty(premanentAddressZipCode)) { studentObj["premanentAddressZipCode"] = premanentAddressZipCode};
    if(!isEmpty(premanentAddressCity)) { studentObj["premanentAddressCity"] = premanentAddressCity};
    if(!isEmpty(premanentAddressState)) { studentObj["premanentAddressState"] = premanentAddressState};
    if(!isEmpty(previousSchoolName)) { studentObj["previousSchoolName"] = previousSchoolName};
    if(!isEmpty(previousQualification)) { studentObj["previousQualification"] = previousQualification};
    if(!isEmpty(previousRemarks)) { studentObj["previousRemarks"] = previousRemarks};
    if(!isEmpty(vehicleRoute)) { studentObj["vehicleRoute"] = vehicleRoute};
    if(!isEmpty(vehicleNo)) { studentObj["vehicleNo"] = vehicleNo};
    if(!isEmpty(permanentEducationNumber)) { studentObj["permanentEducationNumber"] = permanentEducationNumber};

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

const fetchStudentById = async (id) => {
    try {
        return await students.findOne({_id: id});
    } catch(err) {
        console.log(`Error : ${{err}}`);
        return null;
    }
}

module.exports = { fetchAcademicsId, add, uploadDocuments, fetchUpdatedAcademicsId, fetchStudentById };