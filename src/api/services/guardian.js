const { isEmpty } = require("lodash");
const guardian = require('../models/guardian');
const mongoose = require('mongoose');

const createGuardian = async (guardianObj, uploadedLocations) => {
    try {
        const { userName, password, firstName, relation, fatherName, motherName, alreadyExists, occupation, income, education, number, email, city, state, premanentAddressHouseNo,
            premanentAddressStreet, premanentAddressZipCode } = guardianObj;
        if(isEmpty(userName)) {
            throw new Error('UserName missing while creating guardian.');
        }
        const existingGuardian = await guardian.findOne({ userName });
        if(!isEmpty(existingGuardian)) {
            return existingGuardian;   
        }
        if(isEmpty(firstName) || isEmpty(number) || isEmpty(email)) {
            throw new Error('Mandatory fields missing whiel creating guardian.');
        }
        const guardianReq = {
            userName,
            password,
            firstName,
            number,
            email
        };
        if(!isEmpty(relation)) { guardianReq["relation"] = relation};
        if(!isEmpty(fatherName)) { guardianReq["fatherName"] = fatherName};
        if(!isEmpty(motherName)) { guardianReq["motherName"] = motherName};
        if(!isEmpty(alreadyExists)) { guardianReq["alreadyExists"] = Boolean(alreadyExists)};
        if(!isEmpty(occupation)) { guardianReq["occupation"] = occupation};
        if(!isEmpty(income)) { guardianReq["income"] = income};
        if(!isEmpty(education)) { guardianReq["education"] = education};
        if(!isEmpty(city)) { guardianReq["city"] = city};
        if(!isEmpty(state)) { guardianReq["state"] = state};
        if(!isEmpty(premanentAddressHouseNo)) { guardianReq["premanentAddressHouseNo"] = premanentAddressHouseNo};
        if(!isEmpty(premanentAddressStreet)) { guardianReq["premanentAddressStreet"] = premanentAddressStreet};
        if(!isEmpty(premanentAddressZipCode)) { guardianReq["premanentAddressZipCode"] = premanentAddressZipCode};
        if(!isEmpty(uploadedLocations) && !isEmpty(uploadedLocations["guardian"]) && !isEmpty(uploadedLocations["guardian"]["image"])) { guardianReq["image"] = uploadedLocations["guardian"]["image"]}
        if(!isEmpty(uploadedLocations) && !isEmpty(uploadedLocations["guardian"]) &&!isEmpty(uploadedLocations["guardian"]["idProofDocument"])) { guardianReq["idProofDocument"] = uploadedLocations["guardian"]["idProofDocument"]}

        return guardian.create(guardianReq);

    }catch(error) {
        throw new Error('Error while creating guardian.');
    }
}

const remove = async (id) => {
    try {
        let deleteGuardian = await guardian.deleteOne({ _id: mongoose.Types.ObjectId(id) });
        if (
            deleteGuardian["deletedCount"] === 1 &&
            deleteGuardian !== null &&
            deleteGuardian !== undefined
          ) {
            return true;
          }
          console.log(`Guardian Not deleted.`);
          return false;
    } catch(err) {
        throw new Error('Error while deleting guardian.');
    }
}

const updateGuardian = async (guardianObj, uploadedLocations, studentRecord) => {
    try {
        const { userName, password, firstName, relation, fatherName, motherName, alreadyExists, occupation, income, education, number, email, city, state, premanentAddressHouseNo,
            premanentAddressStreet, premanentAddressZipCode } = guardianObj;
        const guardianReq = {};
        guardianReq.userName = !isEmpty(userName) ? userName : studentRecord.guardian.userName;
        guardianReq.password = !isEmpty(password) ? password : studentRecord.guardian.password;
        guardianReq.firstName = !isEmpty(firstName) ? firstName : studentRecord.guardian.firstName;
        guardianReq.relation = !isEmpty(relation) ? relation : studentRecord.guardian.relation;
        guardianReq.fatherName = !isEmpty(fatherName) ? fatherName : studentRecord.guardian.fatherName;
        guardianReq.motherName = !isEmpty(motherName) ? motherName : studentRecord.guardian.motherName;
        guardianReq.number = !isEmpty(number) ? number : studentRecord.guardian.number;
        guardianReq.email = !isEmpty(email) ? email : studentRecord.guardian.email;
        guardianReq.alreadyExists = !isEmpty(alreadyExists) ? alreadyExists : studentRecord.guardian.alreadyExists;
        guardianReq.occupation = !isEmpty(occupation) ? occupation : studentRecord.guardian.occupation;
        guardianReq.income = !isEmpty(income) ? income : studentRecord.guardian.income;
        guardianReq.education = !isEmpty(education) ? education : studentRecord.guardian.education;
        guardianReq.city = !isEmpty(city) ? city : studentRecord.guardian.city;
        guardianReq.state = !isEmpty(state) ? state : studentRecord.guardian.state;
        guardianReq.premanentAddressHouseNo = !isEmpty(premanentAddressHouseNo) ? premanentAddressHouseNo : studentRecord.guardian.premanentAddressHouseNo;
        guardianReq.premanentAddressStreet = !isEmpty(premanentAddressStreet) ? premanentAddressStreet : studentRecord.guardian.premanentAddressStreet;
        guardianReq.premanentAddressZipCode = !isEmpty(premanentAddressZipCode) ? premanentAddressZipCode : studentRecord.guardian.premanentAddressZipCode;
        guardianReq.image = !isEmpty(uploadedLocations) && !isEmpty(uploadedLocations["guardian"]) && !isEmpty(uploadedLocations["guardian"]["image"]) ? uploadedLocations["guardian"]["image"] : studentRecord.guardian.image;
        guardianReq.idProofDocument = !isEmpty(uploadedLocations) && !isEmpty(uploadedLocations["guardian"]) &&!isEmpty(uploadedLocations["guardian"]["idProofDocument"]) ? uploadedLocations["guardian"]["idProofDocument"] : studentRecord.guardian.idProofDocument;
        const updatedGuardian = await guardian.findOneAndUpdate(
            { _id: studentRecord.guardian._id },
            guardianReq,
            { new: true}
        );
        return updatedGuardian
    } catch(error) {
        throw new Error('Error while updating guardian.');
    }
}

module.exports = { createGuardian, remove, updateGuardian }