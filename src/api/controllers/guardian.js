
const { isEmpty } = require('lodash');
const students = require('../models/students');
const guardian = require('../models/guardian');
const mongoose = require('mongoose');

const getStudentsWithSameGuardian = async (req, res) => {
    try {
        const { name, number, email } = req.body;
        if(isEmpty(name)) {
            return res.status(400).send({
                messge: "Mandatory fields missing",
                success: false,
              });
        }
        const filterObject = {};
        if(!isEmpty(name)) { filterObject['userName'] = name };
        if(!isEmpty(number)) { filterObject['number'] = number };
        if(!isEmpty(email)) { filterObject['email'] = email };
        const filteredGuardian = await guardian.find(filterObject).select({ "userName": 1, "_id": 1});;
        let guardianIds = filteredGuardian.map(guardian => mongoose.Types.ObjectId(guardian._id));
        const filteredStudents = await students.find({
            guardian: { $in: guardianIds }
        }).populate('academic').populate({
          path: 'fees',
          populate: [{
            path: 'feeType',
            model: 'FeeType'
        }]
        }).exec();
        if (
            filteredStudents === undefined ||
            filteredStudents.length == 0 ||
            filteredStudents === null
        ) {
          return res.status(200).send({
            messge: "No Students found with above filtered criteria.",
            success: false,
          });
        }
      return res. status(200).send({
        students: filteredStudents,
        messge: "All Filtered Students",
        success: true,
      });
    } catch(err) {
        return res.status(400).send({
            messge: "Somethig went wrong",
            success: false,
        });
    }
}

const getAll = async (req, res) => {
  try {
    let allGuardians = await students
      .find()
      .select(
        "-_id -__v -rollNo -admissionDate -firstName -lastName -gender -type -bloodGroup -dob -motherTongue -religion -caste -number -email -presentAddressHouseNo -presentAddressStreet -presentAddressZipCode -presentAddressCity -presentAddressState -premanentAddressHouseNo -premanentAddressStreet -premanentAddressZipCode -premanentAddressCity -premanentAddressState -previousSchoolName -image -idCardDocument -previousQualification -academic -category -active -fees -registerNo -city -state -presentAddress"
      )
      .populate("guardian")
      .populate("guardian2")
      .exec();
    if (
      allGuardians !== undefined &&
      allGuardians.length !== 0 &&
      allGuardians !== null
    ) {
      return res.status(200).send({
        guardians: allGuardians,
        message: "All Guardians",
        success: true,
      });
    } else {
      return res.status(200).send({
        messge: "Guardians does not exist",
        success: false,
      });
    }
  } catch (error) {
    return res.status(400).send({
      messge: "Somethig went wrong",
      success: false,
    });
  }
};

const getGuardianByUserName = async (req, res) => {
  try {
      const userName = req.params['userName'];
      let existingGuardian = await guardian.findOne({userName});
      if (!isEmpty(existingGuardian)) {
        return res.status(200).send({
          guardian: existingGuardian,
          message: "Guardian Exists",
          success: true,
        });
      } else {
        return res.status(200).send({
          messge: "Guardian does not exist",
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

module.exports = { getStudentsWithSameGuardian, getAll, getGuardianByUserName };
