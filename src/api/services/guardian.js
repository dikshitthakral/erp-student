const { isEmpty } = require("lodash");
const guardian = require("../models/guardian");
const guardian2 = require("../models/guardian2");
const mongoose = require("mongoose");

const createGuardian = async (guardianObj) => {
  try {
    const {
      userName,
      password,
      firstName,
      relation,
      alreadyExists,
      occupation,
      number,
      email,
      isPrimary
    } = guardianObj;
    if (isEmpty(userName)) {
      throw new Error("UserName missing while creating guardian.");
    }
    const existingGuardian = await guardian.findOne({ userName });
    if (!isEmpty(existingGuardian)) {
      return existingGuardian;
    }
    if (isEmpty(firstName) || isEmpty(number) || isEmpty(email)) {
      throw new Error("Mandatory fields missing whiel creating guardian.");
    }
    const guardianReq = {
      userName,
      password,
      firstName,
      number,
      email,
    };
    if (!isEmpty(relation)) {
      guardianReq["relation"] = relation;
    }
    if (!isEmpty(alreadyExists)) {
      guardianReq["alreadyExists"] = Boolean(alreadyExists);
    }
    if (!isEmpty(occupation)) {
      guardianReq["occupation"] = occupation;
    }
    if (!isEmpty(isPrimary)) {
      guardianReq["isPrimary"] = isPrimary;
    }

    return guardian.create(guardianReq);
  } catch (error) {
    throw new Error("Error while creating guardian.");
  }
};
const createGuardian2 = async (guardianObj) => {
  try {
    const { firstName, relation, occupation, number, email,isPrimary } = guardianObj;
    if (isEmpty(firstName)) {
      throw new Error("firstName missing while creating guardian 2.");
    }
    const existingGuardian = await guardian2.findOne({ firstName });
    if (!isEmpty(existingGuardian)) {
      return existingGuardian;
    }
    if (isEmpty(firstName) || isEmpty(number) || isEmpty(email)) {
      throw new Error("Mandatory fields missing whiel creating guardian 2.");
    }
    const guardianReq = {
      firstName,
      number,
      email,
    };
    if (!isEmpty(relation)) {
      guardianReq["relation"] = relation;
    }
    if (!isEmpty(occupation)) {
      guardianReq["occupation"] = occupation;
    }
    if (!isEmpty(isPrimary)) {
      guardianReq["isPrimary"] = isPrimary;
    }
    return guardian2.create(guardianReq);
  } catch (error) {
    throw new Error("Error while creating guardian 2.");
  }
};

const remove = async (id) => {
  try {
    let deleteGuardian = await guardian.deleteOne({
      _id: mongoose.Types.ObjectId(id),
    });
    if (
      deleteGuardian["deletedCount"] === 1 &&
      deleteGuardian !== null &&
      deleteGuardian !== undefined
    ) {
      return true;
    }
    return false;
  } catch (err) {
    throw new Error("Error while deleting guardian.");
  }
};

const updateGuardian = async (
  guardianObj,
  studentRecord
) => {
  try {
    const {
      userName,
      password,
      firstName,
      relation,
      alreadyExists,
      occupation,
      number,
      email,
      isPrimary
    } = guardianObj;
    const guardianReq = {};
    guardianReq.userName = !isEmpty(userName)
      ? userName
      : studentRecord.guardian.userName;
    guardianReq.password = !isEmpty(password)
      ? password
      : studentRecord.guardian.password;
    guardianReq.firstName = !isEmpty(firstName)
      ? firstName
      : studentRecord.guardian.firstName;
    guardianReq.relation = !isEmpty(relation)
      ? relation
      : studentRecord.guardian.relation;
    guardianReq.number = !isEmpty(number)
      ? number
      : studentRecord.guardian.number;
    guardianReq.email = !isEmpty(email) ? email : studentRecord.guardian.email;
    guardianReq.alreadyExists = !isEmpty(alreadyExists)
      ? alreadyExists
      : studentRecord.guardian.alreadyExists;
    guardianReq.occupation = !isEmpty(occupation)
      ? occupation
      : studentRecord.guardian.occupation;
      guardianReq.isPrimary = !isEmpty(isPrimary) ? isPrimary : studentRecord.guardian.isPrimary
      const id = studentRecord?.guardian?._id.toString();
    const updatedGuardian = await guardian.findOneAndUpdate(
      { _id: id },
      { $set: guardianReq },
      { new: true }
    );
    if (isEmpty(updatedGuardian)) {
      throw new Error("Error while updating guardian.");
    } else {
      return updatedGuardian;
    }

    
  } catch (error) {
    throw new Error("Error while updating guardian.");
  }
};

// update guradian 2
const updateGuardian2 = async (
  guardianObj,
  studentRecord
) => {
  try {
    const { firstName, relation, occupation, number, email,isPrimary } = guardianObj;
    const guardianReq = {};
    guardianReq.firstName = !isEmpty(firstName)
      ? firstName
      : studentRecord.guardian2.firstName;
    guardianReq.relation = !isEmpty(relation)
      ? relation
      : studentRecord.guardian2.relation;
    guardianReq.number = !isEmpty(number)
      ? number
      : studentRecord.guardian2.number;
    guardianReq.email = !isEmpty(email) ? email : studentRecord.guardian2.email;
    guardianReq.occupation = !isEmpty(occupation)
      ? occupation
      : studentRecord.guardian2.occupation;
      guardianReq.isPrimary = !isEmpty(isPrimary) ? isPrimary : studentRecord.guardian2.isPrimary
    const updatedGuardian = await guardian2.findOneAndUpdate(
      { _id: studentRecord.guardian2._id },
      guardianReq,
      { new: true }
    );
    return updatedGuardian;
  } catch (error) {
    throw new Error("Error while updating guardian.");
  }
};
module.exports = { createGuardian,createGuardian2, remove, updateGuardian,updateGuardian2 };
