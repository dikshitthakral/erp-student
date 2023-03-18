
const { isEmpty } = require('lodash');
const students = require('../models/students');
const guardian = require('../models/guardian');
const mongoose = require('mongoose');

const getStudentsWithSameGuardian = async (req, res) => {
    try {
        const { name, number, email } = req.body;
        if(isEmpty(name) || isEmpty(number) || isEmpty(email)) {
            return res.status(400).send({
                messge: "Mandatory fields missing",
                success: false,
              });
        }
        const filteredGuardian = await guardian.find({
            userName: name,
            number,
            email
        }).select({ "userName": 1, "_id": 1});;
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

module.exports = { getStudentsWithSameGuardian };