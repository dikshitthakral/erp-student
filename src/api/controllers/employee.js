const Employee = require("../models/employee");
const fs = require("fs");
const mongoose = require('mongoose');
const { isEmpty } = require("lodash");
const employeeService = require('../services/employee');
const csvtojsonV2=require("csvtojson/v2");
const util = require("util");
const { leavesRequest } = require("../models/humanResources");
const department = require("../models/department");

const save = async (req, res) => {
    try {
        const { joiningDate, qualification, experienceDetails, totalExperience, name, gender, bloodGroup, religion, dob, number, email, 
          presentAddressHouseNo, presentAddressStreet, presentAddressZipCode, presentAddressCity, presentAddressState, 
          premanentAddressHouseNo, premanentAddressStreet, premanentAddressZipCode, premanentAddressCity, premanentAddressState
          ,userName, password, facebook, twitter, linkedin, skipBankDetails, bankName, holderName, bankBranch, 
          bankAddress, ifscCode, accountNumber, designation, department, firstName, lastName } = req.body;
        const file = req.file;
        let image = '';
        if(!isEmpty(file)) {
            image = await employeeService.uploadImage(file);
        }
        if (
          !isEmpty(joiningDate) &&
          !isEmpty(qualification) &&
          !isEmpty(firstName) &&
          !isEmpty(lastName) &&
          !isEmpty(number) &&
          !isEmpty(userName) &&
          !isEmpty(email)
        ) {
          let employeeCreation = {
            joiningDate,
            qualification,
            firstName,
            lastName,
            number,
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
          if(!isEmpty(name)){ employeeCreation['name'] = name; }
          if(!isEmpty(religion)){ employeeCreation['religion'] = religion; }
          if(!isEmpty(dob)){ employeeCreation['dob'] = dob; }
          if(!isEmpty(presentAddressHouseNo)){ employeeCreation['presentAddressHouseNo'] = presentAddressHouseNo; }
          if(!isEmpty(presentAddressStreet)){ employeeCreation['presentAddressStreet'] = presentAddressStreet; }
          if(!isEmpty(presentAddressZipCode)){ employeeCreation['presentAddressZipCode'] = presentAddressZipCode; }
          if(!isEmpty(presentAddressCity)){ employeeCreation['presentAddressCity'] = presentAddressCity; }
          if(!isEmpty(presentAddressState)){ employeeCreation['presentAddressState'] = presentAddressState; }
          if(!isEmpty(premanentAddressHouseNo)){ employeeCreation['premanentAddressHouseNo'] = premanentAddressHouseNo; }
          if(!isEmpty(premanentAddressStreet)){ employeeCreation['premanentAddressStreet'] = premanentAddressStreet; }
          if(!isEmpty(premanentAddressZipCode)){ employeeCreation['premanentAddressZipCode'] = premanentAddressZipCode; }
          if(!isEmpty(premanentAddressCity)){ employeeCreation['premanentAddressCity'] = premanentAddressCity; }
          if(!isEmpty(premanentAddressState)){ employeeCreation['premanentAddressState'] = premanentAddressState; }
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
            message: "Empty Fields found. Either joiningDate, qualification, name, number and userName.",
            success: false,
          });
        }
      } catch (error) {
        return res.status(500).json({ message: error.message || 'Something went wrong', success: false });
      }
}

const getAll = async (req, res) => {
    try {
        const designation = req.params.designation;
        const perPage = 15, page = Math.max(0, req.params.page || 0);
        let query = {};
        if(!isEmpty(designation)) {
          query['designation'] = designation;
        }
        const totalCount = await Employee.count(query);
        let allEmployees = await Employee.find(query).limit(perPage)
        .skip(perPage * page)
        .sort({
            name: 'asc'
        })
        .populate('designation').populate('department').exec();
        if (
            allEmployees !== undefined &&
            allEmployees.length !== 0 &&
            allEmployees !== null
        ) {
          return res.status(200).send({
            employees: allEmployees.map((employee) => {
              if(employee.name) {
                let emp = employee.name.split(' ');
                employee.firstName = emp && emp[0];
                employee.lastName = emp && emp[1];
              }
            }),
            totalCount: totalCount,
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
        const id = req.params['id'];
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
        const { employeeId, joiningDate, qualification, experienceDetails, totalExperience, name, gender, bloodGroup, religion, dob, number, email, presentAddressHouseNo, presentAddressStreet, 
          presentAddressZipCode, presentAddressCity, presentAddressState, premanentAddressHouseNo, premanentAddressStreet, 
          premanentAddressZipCode, premanentAddressCity, premanentAddressState ,userName, password, facebook, twitter, linkedin, 
          skipBankDetails, bankName, holderName, bankBranch, bankAddress, ifscCode, accountNumber, designation, department, firstName, lastName } = req.body;

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
        profile.firstName = !isEmpty(firstName) ? firstName : employee.firstName;
        profile.lastName = !isEmpty(lastName) ? lastName : employee.lastName;
        profile.number = !isEmpty(number) ? number : employee.number;
        profile.userName = !isEmpty(userName) ? userName : employee.userName;
        profile.email = !isEmpty(email) ? email : employee.email;
        if(!isEmpty(experienceDetails)) { profile.experienceDetails = experienceDetails }
        if(!isEmpty(totalExperience)) { profile.totalExperience = totalExperience }
        if(!isEmpty(gender)) { profile.gender = gender}
        if(!isEmpty(bloodGroup)) { profile.bloodGroup = bloodGroup}
        if(!isEmpty(religion)) { profile.religion = religion }
        if(!isEmpty(dob)) { profile.dob = dob }
        if(!isEmpty(presentAddressHouseNo)){ profile['presentAddressHouseNo'] = presentAddressHouseNo; }
        if(!isEmpty(presentAddressStreet)){ profile['presentAddressStreet'] = presentAddressStreet; }
        if(!isEmpty(presentAddressZipCode)){ profile['presentAddressZipCode'] = presentAddressZipCode; }
        if(!isEmpty(presentAddressCity)){ profile['presentAddressCity'] = presentAddressCity; }
        if(!isEmpty(presentAddressState)){ profile['presentAddressState'] = presentAddressState; }
        if(!isEmpty(premanentAddressHouseNo)){ profile['premanentAddressHouseNo'] = premanentAddressHouseNo; }
        if(!isEmpty(premanentAddressStreet)){ profile['premanentAddressStreet'] = premanentAddressStreet; }
        if(!isEmpty(premanentAddressZipCode)){ profile['premanentAddressZipCode'] = premanentAddressZipCode; }
        if(!isEmpty(premanentAddressCity)){ profile['premanentAddressCity'] = premanentAddressCity; }
        if(!isEmpty(premanentAddressState)){ profile['premanentAddressState'] = premanentAddressState; }
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
            messge: error.message || "Somethig went wrong",
            success: false,
        });
    }
}

const bulkSave = async (req, res) => {
    try{
        const file = req.file;
        const employees = await csvtojsonV2().fromFile(file.path);
        for(let employeeObj of employees) {
            const { joiningDate, qualification, experienceDetails, totalExperience, name, gender, bloodGroup, religion, dob, number, email, presentAddressHouseNo, 
              presentAddressStreet, presentAddressZipCode, presentAddressCity, presentAddressState, premanentAddressHouseNo, premanentAddressStreet, 
              premanentAddressZipCode, premanentAddressCity, premanentAddressState ,userName, password, facebook, twitter, linkedin, skipBankDetails, 
              bankName, holderName, bankBranch, bankAddress, ifscCode, accountNumber, designation, department, firstName, lastName } = employeeObj;
            if (
              !isEmpty(joiningDate) &&
              !isEmpty(qualification) &&
              !isEmpty(firstName) &&
              !isEmpty(lastName) &&
              !isEmpty(number) &&
              !isEmpty(userName) &&
              !isEmpty(email)
            ) {
              let employeeCreation = {
                joiningDate,
                qualification,
                firstName,
                lastName,
                number,
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
              if(!isEmpty(name)){ employeeCreation['name'] = name; }
              if(!isEmpty(religion)){ employeeCreation['religion'] = religion; }
              if(!isEmpty(dob)){ employeeCreation['dob'] = dob; }
              if(!isEmpty(presentAddressHouseNo)){ employeeCreation['presentAddressHouseNo'] = presentAddressHouseNo; }
              if(!isEmpty(presentAddressStreet)){ employeeCreation['presentAddressStreet'] = presentAddressStreet; }
              if(!isEmpty(presentAddressZipCode)){ employeeCreation['presentAddressZipCode'] = presentAddressZipCode; }
              if(!isEmpty(presentAddressCity)){ employeeCreation['presentAddressCity'] = presentAddressCity; }
              if(!isEmpty(presentAddressState)){ employeeCreation['presentAddressState'] = presentAddressState; }
              if(!isEmpty(premanentAddressHouseNo)){ employeeCreation['premanentAddressHouseNo'] = premanentAddressHouseNo; }
              if(!isEmpty(premanentAddressStreet)){ employeeCreation['premanentAddressStreet'] = premanentAddressStreet; }
              if(!isEmpty(premanentAddressZipCode)){ employeeCreation['premanentAddressZipCode'] = premanentAddressZipCode; }
              if(!isEmpty(premanentAddressCity)){ employeeCreation['premanentAddressCity'] = premanentAddressCity; }
              if(!isEmpty(premanentAddressState)){ employeeCreation['premanentAddressState'] = premanentAddressState; }
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
              try {
                await Employee.create(employeeCreation);
              } catch(err) {
                continue;
              }
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
            messge: err.message || "Somethig went wrong",
            success: false,
        });
    }
}

const getByDesignation = async (req, res) => {
  try {
      const designationId = req.params['designationId'];
      let getEmployeesByDesignation = await Employee.find({ designation: mongoose.Types.ObjectId(designationId)})
          .populate('designation').populate('department').exec()
      if (!isEmpty(getEmployeesByDesignation)) {
        return res.status(200).send({
          employees: getEmployeesByDesignation.map((employee) => {
            if(employee.name) {
              let emp = employee.name.split(' ');
              employee.firstName = emp && emp[0];
              employee.lastName = emp && emp[1];
            }
          }),
          messge: "Employee By Designation",
          success: true,
        });
      } else {
        return res.status(400).send({
          messge: "Employees does not exist",
          success: false,
        });
      }
    } catch (error) {
      return res.status(400).send({
        messge: "Something went wrong",
        success: false,
      });
    }
}

const updateSalaryGradeForEmployee = async (req, res) => {
    try {
      const { salaryGrades } = req.body;
      const employeeIds = [];
      for(let salaryGrade of salaryGrades) {
        let employeeId = salaryGrade.employeeId;
        let salaryId = salaryGrade.salaryId
        employeeIds.push(employeeId);
        let updateEmployeeWithGrade = await Employee.findOneAndUpdate(
          { _id: employeeId },
          { $set: { salaryGrade: salaryId } }
        );
        if (
          updateEmployeeWithGrade.length === 0 ||
          updateEmployeeWithGrade === undefined ||
          updateEmployeeWithGrade === null ||
          updateEmployeeWithGrade === ""
        ) {
            return res.status(200)
                .json([{ msg: "Employee not found!!!", res: "error", }]);
        }
      }
      const employeesData = await Employee.find({ _id: { $in: employeeIds }}).populate('salaryGrade').exec();
      return res.status(200)
          .json([{ msg: "Employee updated with salaryGrade successflly", data: employeesData, res: "success" }]);
  } catch(err) {
      return res.status(500).send({
          messge: "Somethig went wrong",
          success: false,
      });
  }
}

const getAllLeavesRequestByDesignation = async (req, res) => {
  try {
    const designationId = req.params['designationId'];
    let getEmployeesByDesignation = await Employee.find({ designation: mongoose.Types.ObjectId(designationId)})
        .populate('designation').populate('department').exec();
    if (isEmpty(getEmployeesByDesignation)) {
      return res.status(400).send({
        messge: "Employees does not exist",
        success: false,
      });
    }
    let employeesLeavesRequest = [];
    for(let employee of getEmployeesByDesignation) {
        const result = await leavesRequest.find({ employee: employee._id});
        employeesLeavesRequest.push({
          employee: employee._doc,
          leavesRequest: !isEmpty(result) ? result.map(leavesRequest => leavesRequest._doc) : undefined
        });
    }
    if (!isEmpty(employeesLeavesRequest)) {
      return res.status(200).send({
        employees: employeesLeavesRequest,
        messge: "Employee and Leaves Request",
        success: true,
      });
    }
  } catch (error) {
    return res.status(400).send({
      messge: "Something went wrong",
      success: false,
    });
  }
};

const getById = async (req, res) => {
  try {
      const id = req.params['id'];
      let employeeById = await Employee.findOne({ _id: id}).populate('designation').populate('department').
      populate({
        path: 'salaryGrade',
        populate: [{ path: 'allowances', model: 'Allowance'}, { path: 'deductions', model: 'Deduction'}]
      }).exec();
      if (
          employeeById !== undefined &&
          employeeById !== null
      ) {
        if(employeeById.name) {
          let splitName = employeeById.name.split(' ');
          employeeById['firstName'] = splitName && splitName[0];
          employeeById['lastName'] = splitName && splitName[1];
        }
        return res.status(200).send({
          employee: employeeById,
          messge: "Fetched Employee By Id",
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

const employeeLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const employeeData = await Employee.findOne({ userName, password });
    if(isEmpty(employeeData)) {
      return res.status(400).send({
        messge: "Employee not found with given login details",
        success: false,
      });
    }
    const fetchEmployee = await Employee.findOne({
      _id: mongoose.Types.ObjectId(employeeData._id),
    }).populate('designation').populate('department').
    populate({
      path: 'salaryGrade',
      populate: [{ path: 'allowances', model: 'Allowance'}, { path: 'deductions', model: 'Deduction'}]
    }).exec();
    if (
      fetchEmployee === undefined ||
      fetchEmployee === null ||
      fetchEmployee === ""
    ) {
        return res.status(200)
            .json([{ msg: "Employee not found!!!", res: "error", }]);
    } else {
        return res.status(200)
            .json([{ msg: "Employee Profile", data: fetchEmployee, res: "success" }]);
    }
  } catch(err) {
    return res.status(400).send({
      messge: "Somethig went wrong",
      success: false,
    });
  }
}

const adminLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const departmentData = await department.findOne({ name : 'ADMIN'});
    const employeeData = await Employee.findOne({ userName, password, department: departmentData._id });
    if(isEmpty(employeeData)) {
      return res.status(400).send({
        messge: "Employee not found with given login details",
        success: false,
      });
    }
    const fetchEmployee = await Employee.findOne({
      _id: mongoose.Types.ObjectId(employeeData._id),
    }).populate('designation').populate('department').
    populate({
      path: 'salaryGrade',
      populate: [{ path: 'allowances', model: 'Allowance'}, { path: 'deductions', model: 'Deduction'}]
    }).exec();
    if (
      fetchEmployee === undefined ||
      fetchEmployee === null ||
      fetchEmployee === ""
    ) {
        return res.status(200)
            .json([{ msg: "Employee not found!!!", res: "error", }]);
    } else {
        return res.status(200)
            .json([{ msg: "Employee Profile", data: fetchEmployee, res: "success" }]);
    }
  } catch(err) {
    return res.status(400).send({
      messge: "Somethig went wrong",
      success: false,
    });
  }
}

module.exports = { save, getAll, remove, update, bulkSave, getByDesignation, updateSalaryGradeForEmployee, getAllLeavesRequestByDesignation, getById, employeeLogin, adminLogin };
