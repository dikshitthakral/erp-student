const Employee = require("../models/employee");
const fs = require("fs");
const mongoose = require('mongoose');
const { isEmpty } = require("lodash");
const employeeService = require('../services/employee');
const csvtojsonV2=require("csvtojson/v2");
const util = require("util");

const save = async (req, res) => {
    try {
        const { joiningDate, qualification, experienceDetails, totalExperience, name, gender, bloodGroup, religion, dob, number, email, city, state, presentAddress, permanentAddress
            ,userName, password, facebook, twitter, linkedin, skipBankDetails, bankName, holderName, bankBranch, bankAddress, ifscCode, accountNumber, designation, department } = req.body;
        const file = req.file;
        let image = '';
        if(!isEmpty(file)) {
            image = await employeeService.uploadImage(file);
        }
        if (
          !isEmpty(joiningDate) &&
          !isEmpty(qualification) &&
          !isEmpty(name) &&
          !isEmpty(number) &&
          !isEmpty(permanentAddress) &&
          !isEmpty(userName) &&
          !isEmpty(email)
        ) {
          let employeeCreation = {
            joiningDate,
            qualification,
            name,
            number,
            permanentAddress,
            userName,
            email
          };
          if(isEmpty(image)) {
              employeeCreation['image'] = image;
          }  
          if(!isEmpty(experienceDetails)){
              employeeCreation['experienceDetails'] = experienceDetails;
          }
          if(!isEmpty(totalExperience)){
              employeeCreation['totalExperience'] = totalExperience;
          }
          if(!isEmpty(gender)){
              employeeCreation['gender'] = gender;
          }
          if(!isEmpty(bloodGroup)){
              employeeCreation['bloodGroup'] = bloodGroup;
          }
          if(!isEmpty(religion)){ employeeCreation['religion'] = religion; }
          if(!isEmpty(dob)){ employeeCreation['dob'] = dob; }
          if(!isEmpty(city)){ employeeCreation['city'] = city; }
          if(!isEmpty(state)){ employeeCreation['state'] = state; }
          if(!isEmpty(presentAddress)){ employeeCreation['presentAddress'] = presentAddress; }
          if(!isEmpty(password)){ employeeCreation['password'] = password; }
          if(!isEmpty(facebook)){ employeeCreation['facebook'] = facebook; }
          if(!isEmpty(twitter)){ employeeCreation['twitter'] = twitter; }
          if(!isEmpty(linkedin)){ employeeCreation['linkedin'] = linkedin; }
          if(!isEmpty(skipBankDetails)){ employeeCreation['skipBankDetails'] = skipBankDetails; }
          if(!isEmpty(bankName)){ employeeCreation['bankName'] = bankName; }
          if(!isEmpty(holderName)){ employeeCreation['holderName'] = holderName; }
          if(!isEmpty(bankBranch)){ employeeCreation['bankBranch'] = bankBranch; }
          if(!isEmpty(bankAddress)){ employeeCreation['bankAddress'] = bankAddress; }
          if(!isEmpty(ifscCode)){ employeeCreation['ifscCode'] = ifscCode; }
          if(!isEmpty(accountNumber)){ employeeCreation['accountNumber'] = accountNumber; }
          if(!isEmpty(designation)){ employeeCreation['designation'] = designation; }
          if(!isEmpty(department)){ employeeCreation['department'] = department; }
          let employee = await Employee.create(employeeCreation);
            return res.status(200).json({
              employee,
              message: "Added New Employee Successfully",
              success: true,
            });
        } else {
          return res.status(422).json({
            message: "Empty Fields found. Either joiningDate, qualification, name, number, permanentAddress and userName.",
            success: false,
          });
        }
      } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
      }
}

const getAll = async (req, res) => {
    try {
        let allEmployees = await Employee.find().populate('Designation').populate('Department').exec();
        if (
            allEmployees !== undefined &&
            allEmployees.length !== 0 &&
            allEmployees !== null
        ) {
          return res.status(200).send({
            employees: allEmployees,
            messge: "All Employees",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Employee does not exist",
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

const remove = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
          return res.status(200).json({
            message: "Employee Id Not found",
            success: false,
          });
        } else if (!isEmpty(id)) {
          let deleteEmployee = await Employee.deleteOne({ _id: id });
          if (
            deleteEmployee["deletedCount"] === 0 ||
            deleteEmployee === null ||
            deleteEmployee === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Employee Not found ",
              success: true,
            });
          } else if (
            deleteEmployee["deletedCount"] === 1 ||
            deleteEmployee !== null ||
            deleteEmployee !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Employee Deleted Successfully !!! ",
              success: true,
            });
          }
        }
      } catch (error) {
        return res.status(500).json({
          message: "Something went wrong",
          success: false,
        });
      }
}

const update = async (req, res) => {
    try {
        const { employeeId, joiningDate, qualification, experienceDetails, totalExperience, name, gender, bloodGroup, religion, dob, number, email, city, state, presentAddress, permanentAddress
            ,userName, password, facebook, twitter, linkedin, skipBankDetails, bankName, holderName, bankBranch, bankAddress, ifscCode, accountNumber, designation, department } = req.body;

        if (!employeeId) {
            return res.status(400)
                .json([{ msg: "Employee ID is required", res: "error", }]);
        }
        const employee = await Employee.findOne({ _id: mongoose.Types.ObjectId(employeeId) });
        if (isEmpty(employee)) {
            return res.status(400)
                .json([{ msg: "Employee not found.", res: "error", }]);
        }
        let profile = {}
        profile.joiningDate = !isEmpty(joiningDate) ? joiningDate : employee.joiningDate;
        profile.qualification = !isEmpty(qualification) ? qualification : employee.qualification;
        profile.name = !isEmpty(name) ? name : employee.name;
        profile.number = !isEmpty(number) ? number : employee.number;
        profile.permanentAddress = !isEmpty(permanentAddress) ? permanentAddress : employee.permanentAddress;
        profile.userName = !isEmpty(userName) ? userName : employee.userName;
        profile.email = !isEmpty(email) ? email : employee.email;
        if(!isEmpty(experienceDetails)) { profile.experienceDetails = experienceDetails }
        if(!isEmpty(totalExperience)) { profile.totalExperience = totalExperience }
        if(!isEmpty(gender)) { profile.gender = gender}
        if(!isEmpty(bloodGroup)) { profile.bloodGroup = bloodGroup}
        if(!isEmpty(religion)) { profile.religion = religion }
        if(!isEmpty(dob)) { profile.dob = dob }
        if(!isEmpty(city)) { profile.city = city}
        if(!isEmpty(state)) { profile.state = state}
        if(!isEmpty(presentAddress)) { profile.presentAddress = presentAddress}
        if(!isEmpty(password)) { profile.password = password}
        if(!isEmpty(facebook)) { profile.facebook = facebook}
        if(!isEmpty(twitter)) { profile.twitter = twitter}
        if(!isEmpty(linkedin)) { profile.linkedin = linkedin}
        if(!isEmpty(skipBankDetails)) { profile.skipBankDetails = skipBankDetails}
        if(!isEmpty(bankName)) { profile.bankName = bankName}
        if(!isEmpty(holderName)) { profile.holderName = holderName}
        if(!isEmpty(bankBranch)) { profile.bankBranch = bankBranch}
        if(!isEmpty(bankAddress)) { profile.bankAddress = bankAddress}
        if(!isEmpty(ifscCode)) { profile.ifscCode = ifscCode}
        if(!isEmpty(accountNumber)) { profile.accountNumber = accountNumber}
        if(!isEmpty(designation)) { profile.designation = designation}
        if(!isEmpty(department)) { profile.department = department}
        const file = req.file;
        if(!isEmpty(file)) {
            profile.image = await employeeService.uploadImage(file);
        }
        let updateEmployee = await Employee.findOneAndUpdate(
            { _id: employeeId },
            {
                $set: profile
            }
        );
        if (
            updateEmployee.length === 0 ||
            updateEmployee === undefined ||
            updateEmployee === null ||
            updateEmployee === ""
          ) {
              return res.status(200)
                  .json([{ msg: "Employee not found!!!", res: "error", }]);
          } else {
              const employeeData = await Employee.findOne({ _id: employeeId })
              return res.status(200)
                  .json([{ msg: "Employee Profile updated successflly", data: employeeData, res: "success" }]);
          }
    } catch(error) {
        return res.status(400).send({
            messge: "Somethig went wrong",
            success: false,
        });
    }
}

const bulkSave = async (req, res) => {
    try{
        const file = req.file;
        const employees = await csvtojsonV2().fromFile(file.path);
        for(let employeeObj of employees) {
            const { joiningDate, qualification, experienceDetails, totalExperience, name, gender, bloodGroup, religion, dob, number, email, city, state, presentAddress, permanentAddress
                ,userName, password, facebook, twitter, linkedin, skipBankDetails, bankName, holderName, bankBranch, bankAddress, ifscCode, accountNumber, designation, department } = employeeObj;
            if (
              !isEmpty(joiningDate) &&
              !isEmpty(qualification) &&
              !isEmpty(name) &&
              !isEmpty(number) &&
              !isEmpty(permanentAddress) &&
              !isEmpty(userName) &&
              !isEmpty(email)
            ) {
              let employeeCreation = {
                joiningDate,
                qualification,
                name,
                number,
                permanentAddress,
                userName,
                email
              };
              if(!isEmpty(experienceDetails)){
                  employeeCreation['experienceDetails'] = experienceDetails;
              }
              if(!isEmpty(totalExperience)){
                  employeeCreation['totalExperience'] = totalExperience;
              }
              if(!isEmpty(gender)){
                  employeeCreation['gender'] = gender;
              }
              if(!isEmpty(bloodGroup)){
                  employeeCreation['bloodGroup'] = bloodGroup;
              }
              if(!isEmpty(religion)){ employeeCreation['religion'] = religion; }
              if(!isEmpty(dob)){ employeeCreation['dob'] = dob; }
              if(!isEmpty(city)){ employeeCreation['city'] = city; }
              if(!isEmpty(state)){ employeeCreation['state'] = state; }
              if(!isEmpty(presentAddress)){ employeeCreation['presentAddress'] = presentAddress; }
              if(!isEmpty(password)){ employeeCreation['password'] = password; }
              if(!isEmpty(facebook)){ employeeCreation['facebook'] = facebook; }
              if(!isEmpty(twitter)){ employeeCreation['twitter'] = twitter; }
              if(!isEmpty(linkedin)){ employeeCreation['linkedin'] = linkedin; }
              if(!isEmpty(skipBankDetails)){ employeeCreation['skipBankDetails'] = skipBankDetails; }
              if(!isEmpty(bankName)){ employeeCreation['bankName'] = bankName; }
              if(!isEmpty(holderName)){ employeeCreation['holderName'] = holderName; }
              if(!isEmpty(bankBranch)){ employeeCreation['bankBranch'] = bankBranch; }
              if(!isEmpty(bankAddress)){ employeeCreation['bankAddress'] = bankAddress; }
              if(!isEmpty(ifscCode)){ employeeCreation['ifscCode'] = ifscCode; }
              if(!isEmpty(accountNumber)){ employeeCreation['accountNumber'] = accountNumber; }
              if(!isEmpty(designation)){ employeeCreation['designation'] = designation; }
              if(!isEmpty(department)){ employeeCreation['department'] = department; }
              await Employee.create(employeeCreation);
            } else {
              console.log(`Employee with Name ${name} not created`);
            }
        }
        const unlinkFile = util.promisify(fs.unlink);
        await unlinkFile(file.path);
        console.log(`successfully deleted file from path : ${file.path}`);
        return res.status(200).send({
            messge: "Successfull",
            success: true,
        });
    } catch(err) {
        return res.status(500).send({
            messge: "Somethig went wrong",
            success: false,
        });
    }
}

module.exports = { save, getAll, remove, update, bulkSave };