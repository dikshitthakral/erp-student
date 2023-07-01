const storage = require('../services/storage')
const util = require("util");
const fs = require("fs");
const unlinkFile = util.promisify(fs.unlink);
const { unlink } = require('node:fs/promises');
const { isEmpty } = require('lodash');
const  studentService = require('../services/students');
const guardianService = require('../services/guardian');
const academicsService = require('../services/academic');
const FeeData = require('../models/studentAccounting/feeConcession');
const csvtojsonV2=require("csvtojson/v2");
const students = require('../models/students');
const mongoose = require('mongoose');
const jsonexport = require('jsonexport');
const { feeTypeModel } = require('../models/studentAccounting');
const fineSetup = require('../models/studentAccounting/fineSetup');
const marks = require('../models/marks');
const guardian = require('../models/guardian');
const { vehicleRouteModel } = require('../models/transport');
const classService = require('../services/class');
const sectionService = require('../services/section');
const Academics = require('../models/academic');

const uploadImage = async (req, res) => {
    try {
        var file = req.file;
        await storage.uploadFile(file);

        // Deleting from local if uploaded in S3 bucket
        await unlinkFile(req.file.path);
        return res.status(200).send({
            messge: "Uploaded successfully",
            success: true,
        })
      } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

const createAdmission = async (req, res) => {
  try {
    const {
      academicYear,
      section,
      category,
      studentClass,
      rollNo,
      admissionDate,
      firstName,
      type,
      dob,
      number,
      email,
      guardian,
      guardian1,
    } = req.body;
    const files = req?.files;
    let uploadedLocations = {};
    if (!isEmpty(files)) {
      uploadedLocations = await studentService.uploadDocuments(files);
    }
    if (
      isEmpty(academicYear) ||
      isEmpty(section) ||
      isEmpty(category) ||
      isEmpty(studentClass) ||
      isEmpty(guardian) ||
      isEmpty(rollNo) ||
      isEmpty(admissionDate) ||
      isEmpty(firstName) ||
      isEmpty(type) ||
      isEmpty(dob) ||
      isEmpty(number) ||
      isEmpty(email)
    ) {
      return res.status(400).send({
        message: "Empty Fields found.",
        success: false,
      });
    }
    const studentObj = {
      rollNo,
      admissionDate,
      firstName,
      type,
      dob,
      number,
      email,
    };
    // academic section
    const academicId = await studentService.fetchAcademicsId({
      academicYear,
      studentClass,
      section,
    });
    studentObj["academic"] = academicId;
    // category section
    studentObj["category"] = category;
    // guardian section
    const guardianRes = await guardianService.createGuardian(
      guardian,
      uploadedLocations
    );
    studentObj["guardian"] = guardianRes._id;
    // guardian2 section
    if (
      guardian1.relation !== "" &&
      guardian1.firstName !== "" &&
      guardian1.number !== "" &&
      guardian1.email !== "" &&
      guardian1.occupation !== ""
    ) {
      const guardianRes1 = await guardianService.createGuardian2(guardian1);
      studentObj["guardian2"] = guardianRes1._id;
    } else {
      console.log("guardian2 is empty");
      studentObj["guardian2"] = null;
    }
    // student section
    if (!isEmpty(uploadedLocations["image"])) {
      studentObj["image"] = uploadedLocations["image"];
    }
    if (!isEmpty(uploadedLocations["idCardDocument"])) {
      studentObj["idCardDocument"] = uploadedLocations["idCardDocument"];
    }
    const studentRes = await studentService.add(studentObj, req.body);
    const studentCount = await students.find({}).count();
    var today = new Date();
    var year = today.getFullYear();
    year = year.toString().substr(-2);
    regNo = "VIS" + year + "00" + studentCount;
    const updateRegisterNoInStudent = await students.findOneAndUpdate(
      { _id: studentRes._id },
      { $set: { registerNo: regNo } },
      { new: true }
    );
    return res.status(200).json({
      student: updateRegisterNoInStudent,
      message: "Added New Student Successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).send({
      messge: "Something went wrong",
      success: false,
    });
  }
};

const createBulkAdmission = async (req, res) => {
    try {
        const file = req.file;
        const {studentClass, section, academicYear} = req.body;
        if(isEmpty(academicYear) || isEmpty(section) || isEmpty(studentClass)) {
            return res.status(400).send({
                message: "Empty Fields found. Either academic year or section or student class is empty.",
                success: false,
            });
        }
        // academic section
        const academicId = await studentService.fetchAcademicsId({ academicYear, studentClass, section });
        const admissionArray = await csvtojsonV2().fromFile(file.path);
        for(let admissionObj of admissionArray) {
            const { admissionDate, firstName, dob, number, email, guardian } = admissionObj;
            if(isEmpty(guardian) || isEmpty(admissionDate) || isEmpty(firstName) || isEmpty(dob) || isEmpty(email)) {
                console.log("Empty fields found , admission failed.");
                continue;
            }
            const studentObj = {
                admissionDate,
                firstName,
                dob,
                email,
                academic: academicId,
            };
            if(!isEmpty(number)) { studentObj["number"] = number};
            try {
              // guardian section
              const guardianRes = await guardianService.createGuardian(guardian);
              studentObj["guardian"] = guardianRes._id;
              const studentRes = await studentService.add(studentObj, admissionObj);
              const count = await students.find({}).count();
              await students.findOneAndUpdate(
                { _id: studentRes._id },
                { $inc: { registerNo: count }},
                { new: true});
            } catch(err) {
                continue;
            }
        }
        await unlink(file.path);
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

const getAllStudents = async (req, res) => {
    try {
        let allStudents = await students.find().populate('academic').populate('guardian').populate('category').populate('vehicleRoute').exec();
        if (
            allStudents !== undefined &&
            allStudents.length !== 0 &&
            allStudents !== null
        ) {
          return res.status(200).send({
            students: allStudents,
            messge: "All Students",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Students does not exist",
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

const getById = async (req, res) => {
  try {
    const id = req.params["id"];
    let studentResponse = await students
      .findOne({ _id: id })
      .populate("guardian")
      .populate("guardian2")
      .populate("category")
      .populate({
        path: "vehicleRoute",
        populate: [
          { path: "vehicle", model: "Vehicle" },
          { path: "route", model: "Route" },
        ],
      })
      .populate({
        path: "academic",
        populate: [
          { path: "studentClass", model: "Class" },
          { path: "section", model: "Section" },
        ],
      })
      .populate({
        path: "fees",
        populate: [{ path: "feeType", model: "FeeType" }],
      })
      .exec();
    const feeData = await FeeData.findOne({ studentId: id,academicYear:studentResponse?.academic?.academicYear});
    if (studentResponse !== undefined && studentResponse !== null) {
      return res.status(200).send({
        student: { studentResponse, feeData },
        messge: "Fetch Student by id",
        success: true,
      });
    } else {
      return res.status(200).send({
        messge: "Student does not exist",
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


const searchByAcademics = async (req, res) => {
    try {
        const { academicYear, section, studentClass } = req.body;
        const academicsId = await academicsService.getIdIfAcademicExists({ academicYear, section, studentClass });
        const classResponse = await classService.getById(studentClass);
        const sectionResponse = await sectionService.getById(section);
        if(!mongoose.Types.ObjectId.isValid(academicsId)) {
            return res.status(400).send({
                messge: "No records found with above filter critera",
                success: false,
            });
        }
        const filteredStudents = await students.find({academic: mongoose.Types.ObjectId(academicsId) }).populate('academic').populate('guardian').populate('category')
        .populate({
          path: 'fees',
          populate: [{ path: 'feeType', model: 'FeeType'}]
        }).populate('vehicleRoute').exec();
        if (
            filteredStudents !== undefined &&
            filteredStudents.length !== 0 &&
            filteredStudents !== null
        ) {
          const updatedStudents = filteredStudents.map(student => ({
            ...student._doc,
            class: classResponse && classResponse.className,
            section: sectionResponse && sectionResponse.name
          }))
          return res.status(200).send({
            students: updatedStudents,
            messge: "All Filtered Students",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "No Students found with above filtered criteria.",
            success: false,
          });
        }
    } catch(err) {
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
            message: "Student Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const studentRecord = await students.find({_id: mongoose.Types.ObjectId(id)});
          // remove Guardian
          await guardianService.remove(studentRecord.guardian);
          let deleteStudent = await student.deleteOne({ _id: id });
          if (
            deleteStudent["deletedCount"] === 0 ||
            deleteStudent === null ||
            deleteStudent === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Student Not found ",
              success: true,
            });
          } else if (
            deleteStudent["deletedCount"] === 1 &&
            deleteStudent !== null &&
            deleteStudent !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Student Deleted Successfully !!! ",
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

const removeMultiple = async (req, res) => {
    try {
        const { academicYear, section, studentClass } = req.params;
        const academicsId = await academicsService.getIdIfAcademicExists({ academicYear, section, studentClass });
        if(!mongoose.Types.ObjectId.isValid(academicsId)) {
            return res.status(400).send({
                messge: "No records found with above filter critera",
                success: false,
            });
        }
        const filteredStudents = await students.find({academic: mongoose.Types.ObjectId(academicsId) });
        if (
            filteredStudents === undefined ||
            filteredStudents.length === 0 ||
            filteredStudents === null
        ) {
          return res.status(200).send({
            students: filteredStudents,
            messge: "No records found with above filter critera",
            success: true,
          });
        }
        let count = 0;
        for(let studentRecord of filteredStudents) {
            // remove Guardian
            await guardianService.remove(studentRecord.guardian);
            let deleteStudent = await students.deleteOne({ _id: studentRecord._id });
            if (
                deleteStudent["deletedCount"] === 0 ||
                deleteStudent === null ||
                deleteStudent === undefined
            ) {
                console.log(`Student not found or not deleted.`);
            } else if (
                deleteStudent["deletedCount"] === 1 &&
                deleteStudent !== null &&
                deleteStudent !== undefined
            ) {
                count++;
            }
        }
        return res.status(200).json({
            message: `${count} Students deleted Successfully !!! `,
            success: true,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Something went wrong",
          success: false,
        });
      }
}

const generateCsv = async (req, res) => {
    try {
        const { academicYear, section, studentClass } = req.body;
        const academicsId = await academicsService.getIdIfAcademicExists({ academicYear, section, studentClass });
        if(!mongoose.Types.ObjectId.isValid(academicsId)) {
            return res.status(400).send({
                messge: "No records found with above filter critera",
                success: false,
            });
        }
        const filteredStudents = await students.find({academic: mongoose.Types.ObjectId(academicsId) }).select('-_id -__v').populate('academic','-_id -__v').populate('guardian','-_id -__v').populate('category','-_id -__v');
        if (
            filteredStudents !== undefined &&
            filteredStudents.length !== 0 &&
            filteredStudents !== null
        ) {
          const students = await jsonexport(JSON.parse(JSON.stringify(filteredStudents)));
          return res.attachment('students.csv').status(200).send(students);
        } else {
          return res.status(200).send({
            messge: "No Students found with above filtered criteria.",
            success: false,
          });
        }
    } catch(err) {
        return res.status(400).send({
            messge: "Somethig went wrong",
            success: false,
        });
    }
}

const updateStudent = async (req, res) => {
  try {
    let {
      academicYear,
      section,
      category,
      studentClass,
      rollNo,
      admissionDate,
      firstName,
      type,
      dob,
      number,
      email,
      guardian,
      guardian1,
      lastName,
      gender,
      bloodGroup,
      motherTongue,
      religion,
      caste,
      presentAddressHouseNo,
      presentAddressStreet,
      presentAddressZipCode,
      presentAddressCity,
      presentAddressState,
      premanentAddressHouseNo,
      premanentAddressStreet,
      premanentAddressZipCode,
      premanentAddressCity,
      premanentAddressState,
      previousSchoolName,
      previousQualification,
      previousRemarks,
      vehicleRoute,
    } = req.body;

    const id = req.params["id"];
    if (!id) {
      return res.status(200).json({
        message: "Student Id not found",
        success: false,
      });
    }
    const studentRecord = await students
      .findOne({ _id: mongoose.Types.ObjectId(id) })
      .populate("academic")
      .populate("guardian")
      .populate("guardian2")
      .exec();

    const files = req?.files;
    let uploadedLocations = {};
    if (!isEmpty(files)) {
      uploadedLocations = await studentService.uploadDocuments(files);
    }
    const profile = {};
    // academic section
    const academicId = await studentService.fetchUpdatedAcademicsId(
      { academicYear, studentClass, section },
      studentRecord
    );
    profile["academic"] = academicId;
    // category section
    profile["category"] = !isEmpty(category)
      ? category
      : studentRecord.category;
    // guardian section
    const updatedGuardian = await guardianService.updateGuardian(
      guardian ?? {},
      studentRecord
    );

    profile["guardian"] = updatedGuardian._id;
    const updatedGuardian1 = await guardianService.updateGuardian2(
      guardian1 ?? {},
      studentRecord
    );
    profile["guardian2"] = updatedGuardian1._id;
    profile.rollNo = !isEmpty(rollNo) ? rollNo : studentRecord.rollNo;
    profile.admissionDate = !isEmpty(admissionDate)
      ? admissionDate
      : studentRecord.admissionDate;
    profile.firstName = !isEmpty(firstName)
      ? firstName
      : studentRecord.firstName;
    profile.type = !isEmpty(type) ? type : studentRecord.type;
    profile.dob = !isEmpty(dob) ? dob : studentRecord.dob;
    profile.number = !isEmpty(number) ? number : studentRecord.number;
    profile.email = !isEmpty(email) ? email : studentRecord.email;
    profile.lastName = !isEmpty(lastName) ? lastName : studentRecord.lastName;
    profile.gender = !isEmpty(gender) ? gender : studentRecord.gender;
    profile.bloodGroup = !isEmpty(bloodGroup)
      ? bloodGroup
      : studentRecord.bloodGroup;
    profile.motherTongue = !isEmpty(motherTongue)
      ? motherTongue
      : studentRecord.motherTongue;
    profile.religion = !isEmpty(religion) ? religion : studentRecord.religion;
    profile.caste = !isEmpty(caste) ? caste : studentRecord.caste;
    profile.presentAddressHouseNo = !isEmpty(presentAddressHouseNo)
      ? presentAddressHouseNo
      : studentRecord.presentAddressHouseNo;
    profile.presentAddressStreet = !isEmpty(presentAddressStreet)
      ? presentAddressStreet
      : studentRecord.presentAddressStreet;
    profile.presentAddressZipCode = !isEmpty(presentAddressZipCode)
      ? presentAddressZipCode
      : studentRecord.presentAddressZipCode;
    profile.presentAddressCity = !isEmpty(presentAddressCity)
      ? presentAddressCity
      : studentRecord.presentAddressCity;
    profile.presentAddressState = !isEmpty(presentAddressState)
      ? presentAddressState
      : studentRecord.presentAddressState;
    profile.premanentAddressHouseNo = !isEmpty(premanentAddressHouseNo)
      ? premanentAddressHouseNo
      : studentRecord.premanentAddressHouseNo;
    profile.premanentAddressStreet = !isEmpty(premanentAddressStreet)
      ? premanentAddressStreet
      : studentRecord.premanentAddressStreet;
    profile.premanentAddressZipCode = !isEmpty(premanentAddressZipCode)
      ? premanentAddressZipCode
      : studentRecord.premanentAddressZipCode;
    profile.premanentAddressCity = !isEmpty(premanentAddressCity)
      ? premanentAddressCity
      : studentRecord.premanentAddressCity;
    profile.premanentAddressState = !isEmpty(premanentAddressState)
      ? premanentAddressState
      : studentRecord.premanentAddressState;
    profile.previousSchoolName = !isEmpty(previousSchoolName)
      ? previousSchoolName
      : studentRecord.previousSchoolName;
    profile.previousQualification = !isEmpty(previousQualification)
      ? previousQualification
      : studentRecord.previousQualification;
    profile.previousRemarks = !isEmpty(previousRemarks)
      ? previousRemarks
      : studentRecord.previousRemarks;
    profile.vehicleRoute = !isEmpty(vehicleRoute)
      ? vehicleRoute
      : studentRecord.vehicleRoute;
    profile.image = !isEmpty(uploadedLocations["image"])
      ? uploadedLocations["image"]
      : studentRecord.image;
    profile.idCardDocument = !isEmpty(uploadedLocations["idCardDocument"])
      ? uploadedLocations["idCardDocument"]
      : studentRecord.idCardDocument;
    let updateStudent = await students.findOneAndUpdate({ _id: id }, profile);
    if (
      updateStudent.length === 0 ||
      updateStudent === undefined ||
      updateStudent === null ||
      updateStudent === ""
    ) {
      return res
        .status(200)
        .json([{ msg: "Student not found!!!", res: "error" }]);
    } else {
      const studentData = await students.findOne({ _id: id });
      return res.status(200).json([
        {
          msg: "Student Profile updated successflly",
          data: studentData,
          res: "success",
        },
      ]);
    }
  } catch (err) {
    return res.status(500).send({
      messge: "Somethig went wrong",
      success: false,
    });
  }
};

const addFeesStructure = async (req, res) => {
  try {
      const { studentId, feeType, discount, status, paidAmount } = req.body;
      const feeTypeResult = await feeTypeModel.findOne({_id: mongoose.Types.ObjectId(feeType)});
      if (isEmpty(feeTypeResult)) {
          return res.status(400)
              .json([{ msg: "FeeType not found.", res: "error", }]);
      }
      const studentRecord = await students.findOne({_id: mongoose.Types.ObjectId(studentId)});
      if (isEmpty(studentRecord)) {
        return res.status(400)
            .json([{ msg: "Student not found.", res: "error", }]);
      }
      const feeObject = {
        feeType,
        discount: isNaN(discount) ? 0 : discount,
        paidAmount : isNaN(paidAmount) ? 0 : paidAmount,
        status: isEmpty(status) ? 'UNPAID' : status,
        totalAmount: feeTypeResult.amount
      }
      const fees = isEmpty(studentRecord.fees) ? [feeObject] : [...studentRecord.fees, feeObject];
      let updateStudent = await students.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(studentId) },
          { $set: { fees: fees } }
      );
      if (
        updateStudent.length === 0 ||
        updateStudent === undefined ||
        updateStudent === null ||
        updateStudent === ""
      ) {
          return res.status(200)
              .json([{ msg: "Update Fees in student", res: "error", }]);
      } else {
          const studentsData = await students.findOne({ _id: mongoose.Types.ObjectId(studentId) }).populate({
            path: 'fees',
            populate: [{
              path: 'feeType',
              model: 'FeeType'
          }]
          }).exec();
          return res.status(200)
              .json([{ msg: "Fees in Student updated successflly", data: studentsData, res: "success" }]);
      }
  } catch (error) {
      return res.status(400).send({
        messge: "Somethig went wrong",
        success: false,
      });
    }
}

const searchStudentsFeeByAcademics = async (req, res) => {
    try {
      const { academicYear, section, studentClass } = req.body;
      const academicsId = await academicsService.getIdIfAcademicExists({ academicYear, section, studentClass });
      if(!mongoose.Types.ObjectId.isValid(academicsId)) {
          return res.status(400).send({
              messge: "No records found with above filter critera",
              success: false,
          });
      }
      const filteredStudents = await students.find({academic: mongoose.Types.ObjectId(academicsId) }).populate('academic').populate({
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
      let updatedStudents = [];
      for(let student of filteredStudents) {
        let updatedFees = [];
        for(let fee of student._doc.fees) {
          let feeDoc = fee._doc
          let feeTypeId = feeDoc.feeType._id;
          const fineSetupResult = await fineSetup.findOne({feeType: mongoose.Types.ObjectId(feeTypeId)});
          if (isEmpty(fineSetupResult)) {
            updatedFees.push({...feeDoc, balance: feeDoc.totalAmount - feeDoc.discount });
          } else {
            let currentDate = new Date();
            let dueDate = new Date(feeDoc.feeType.dueDate);
            if(dueDate >= currentDate){
              updatedFees.push({...feeDoc, balance: feeDoc.totalAmount - feeDoc.discount });
            } else {
              const fine = fineSetupResult.fineType === 'Fixed' ? fineSetupResult.fineValue : totalAmount - ((totalAmount * fineSetupResult.fineValue)/100);
              updatedFees.push({...feeDoc, fine: fine, balance: feeDoc.totalAmount - feeDoc.discount + fine });
            }
          }
      }
      updatedStudents.push({ ...student._doc, fees: updatedFees});
    }
    return res. status(200).send({
      students: updatedStudents,
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

const updateFeeStatus = async (req, res) => {
    try {
      const { feeTypeIds } = req.body;
      const studentId = req.params['studentId'];
      const studentRecord = await students.findOne({_id: mongoose.Types.ObjectId(studentId) }).populate('academic').populate({
        path: 'fees',
        populate: [{
          path: 'feeType',
          model: 'FeeType'
      }]
      }).exec();
      if (
        studentRecord === undefined ||
        studentRecord.length == 0 ||
        studentRecord === null
      ) {
        return res.status(200).send({
          messge: "No Students found with above filtered criteria.",
          success: false,
        });
      }
      let updatedFees = [];
      for(let fee of studentRecord._doc.fees) {
          let feeDoc = fee._doc
          let feeTypeId = feeDoc.feeType._id;
          if(feeTypeIds.includes(String(feeTypeId))) {
            const fineSetupResult = await fineSetup.findOne({feeType: mongoose.Types.ObjectId(feeTypeId)});
            if (isEmpty(fineSetupResult)) {
              updatedFees.push({...feeDoc, balance: 0, status: 'PAID', paidAmount: feeDoc.totalAmount - feeDoc.discount });
            } else {
              let currentDate = new Date();
              let dueDate = new Date(feeDoc.feeType.dueDate);
              if(dueDate >= currentDate){
                updatedFees.push({...feeDoc, balance: 0 , status: 'PAID', paidAmount: feeDoc.totalAmount - feeDoc.discount });
              } else {
                const fine = fineSetupResult.fineType === 'Fixed' ? fineSetupResult.fineValue : totalAmount - ((totalAmount * fineSetupResult.fineValue)/100);
                updatedFees.push({...feeDoc, fine: fine, balance: 0, status: 'PAID',paidAmount: feeDoc.totalAmount - feeDoc.discount + fine });
              }
            }
          } else {
            updatedFees.push({...feeDoc})
          }
      }
      let updateStudent = await students.findOneAndUpdate(
          { _id: studentId },
          { $set: { fees: updatedFees } }
      );
        if (
          updateStudent.length === 0 ||
          updateStudent === undefined ||
          updateStudent === null ||
          updateStudent === ""
        ) {
            return res.status(200)
                .json([{ msg: "Student not found!!!", res: "error", }]);
        } else {
            const studentData = await students.findOne({ _id: studentId }).populate({
              path: 'fees',
              populate: [{
                path: 'feeType',
                model: 'FeeType'
            }]
            }).exec();
            return res.status(200)
                .json([{ msg: "Student Fees updated successflly", data: studentData, res: "success" }]);
        }
  } catch(err) {
      return res.status(500).send({
          messge: "Somethig went wrong",
          success: false,
      });
  }
}

const fetchStudentsByFilter = async (req, res) => {
    try {
      const type = req.params['type'];
      const { academicYear, caste, fromDate, toDate, studentClass } = req.body;
      const academicsList = await Academics.find({ academicYear: academicYear })
            .populate('studentClass').populate('section');
      if(type === 'GENDER') {
        const result = await genderWiseResponse(academicsList);
        return res. status(200).send({
          genderResponse: result,
          messge: "All Gender wise class response",
          success: true,
        });
      }
      else if(type === 'CASTE') {
        const result = await casteWiseResponse(academicsList, caste);
        return res. status(200).send({
          casteResponse: result,
          messge: "All Caste wise class response",
          success: true,
        });
      } else if(type === 'CLASS') {
        const result = await classWiseResponse(academicYear, studentClass);
        return res. status(200).send({
          genderResponse: result,
          messge: "All Gender wise class response",
          success: true,
        });
      } else {
        const result = await dateWiseResponse(academicsList, fromDate, toDate);
        return res. status(200).send({
          dateResponse: result,
          messge: "All Date wise class response",
          success: true,
        });
      }
  } catch(err) {
      return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
      });
  }
}

const genderWiseResponse = async (academicList) => {
  try {
    let genderList = [];
    for(let academic of academicList) {
      const countMaleStudents = await students.find({
        academic : academic._id,
        gender: 'Male'
      }).count();
      const countFemaleStudents = await students.find({
        academic : academic._id,
        gender: 'Female'
      }).count();
      genderList.push({
        ...academic._doc,
        boy: countMaleStudents,
        girl: countFemaleStudents,
        total: countMaleStudents + countFemaleStudents
      })
    }
    return genderList;
  } catch(err) {
    throw err;
  }
}

const casteWiseResponse = async (academicList, caste) => {
  try {
    let casteList = [];
    for(let academic of academicList) {
      const countCasteStudents = await students.find({
        academic : academic._id,
        caste: caste
      }).count();
      casteList.push({
        ...academic._doc,
        caste,
        total: countCasteStudents
      })
    }
    return casteList;
  } catch(err) {
    throw err;
  }
}

const classWiseResponse = async (academicYear, studentClass) => {
  try {
    const academicList = await Academics.find({ academicYear: academicYear, studentClass })
            .populate('studentClass').populate('section');
    let classList = [];
    for(let academic of academicList) {
      const countStudents = await students.find({
        academic : academic._id
      }).count();
      classList.push({
        ...academic._doc,
        total: countStudents
      })
    }
    return classList;
  } catch(err) {
    throw err;
  }
}

const dateWiseResponse = async (academicList, fromDate, toDate) => {
  try {
    let dateList = [];
    for(let academic of academicList) {
      const countDateStudents = await students.find({
        academic : academic._id,
        admissionDate: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        }
      }).count();
      dateList.push({
        ...academic._doc,
        fromDate,
        toDate,
        total: countDateStudents
      })
    }
    return dateList;
  } catch(err) {
    throw err;
  }
}

const fetchStudentsByStatus = async (req, res) => {
  try {
      const { academicYear, section, studentClass } = req.body;
      const status = req.params['status'];
      const academicsId = await academicsService.getIdIfAcademicExists({ academicYear, section, studentClass });
      if(!mongoose.Types.ObjectId.isValid(academicsId)) {
          return res.status(400).send({
              messge: "No records found with above filter critera",
              success: false,
          });
      }
      const filteredStudents = await students.find({
        academic: academicsId,
        active: Boolean(status)
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

const updateStatus = async (req, res) => {
  try {
      const { studentId, status } = req.body;
      let updateStudent = await students.findOneAndUpdate(
        { _id: studentId },
        { $set: {active: Boolean(status) }}
      );
      if (
        updateStudent.length === 0 ||
        updateStudent === undefined ||
        updateStudent === null ||
        updateStudent === ""
      ) {
          return res.status(200)
              .json([{ msg: "Student not found!!!", res: "error", }]);
      } else {
          const studentData = await students.findOne({ _id: studentId }).populate('academic').populate({
            path: 'fees',
            populate: [{
              path: 'feeType',
              model: 'FeeType'
          }]
          }).exec()
          return res.status(200)
              .json([{ msg: "Student Profile updated successflly", data: studentData, res: "success" }]);
      }
  } catch(err) {
      return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
      });
  }
}

const promoteStudent = async (req, res) => {
  try {
    const { studentId, academicYear, section, studentClass,rollNo } = req.body;
    const studentData = await students.findOne({ _id: mongoose.Types.ObjectId(studentId) });
    if(isEmpty(studentData)) {
      return res.status(400).send({
        messge: "Student not found with given id",
        success: false,
      });
    }
    // academic section
    const academicId = await studentService.fetchAcademicsId({ academicYear, studentClass, section });
    let updateObj = {
      academic: academicId,
      rollNo,
    }
    let updateStudent = await students.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(studentId) },
      { $set: updateObj }
    );
    if (
      updateStudent.length === 0 ||
      updateStudent === undefined ||
      updateStudent === null ||
      updateStudent === ""
    ) {
        return res.status(200)
            .json([{ msg: "Student not found!!!", res: "error", }]);
    } else {
        const studentData = await students.findOne({ _id: mongoose.Types.ObjectId(studentId) }).populate('academic').populate('guardian').populate('category').populate('vehicleRoute').exec();
        return res.status(200)
            .json([{ msg: "Student Profile updated successflly", data: studentData, res: "success" }]);
    }
  } catch(err) {
    return res.status(400).send({
      messge: "Somethig went wrong",
      success: false,
    });
  }
}

const fetchStudentMarks = async (req, res) => {
  try {
    const studentId = req.params["studentId"];
    const studentData = await students.findOne({ _id: mongoose.Types.ObjectId(studentId) });
    if(isEmpty(studentData)) {
      return res.status(400).send({
        messge: "Student not found with given id",
        success: false,
      });
    }
    const fetchMarks = await marks.find({
      academic: mongoose.Types.ObjectId(studentData.academic),
      student: mongoose.Types.ObjectId(studentId)
    });
    if (
      fetchMarks.length === 0 ||
      fetchMarks === undefined ||
      fetchMarks === null ||
      fetchMarks === ""
    ) {
        return res.status(200)
            .json([{ msg: "Marks not found!!!", res: "error", }]);
    } else {
        let totalMakrks = 0;
        for(let mark of fetchMarks) {
          totalMakrks += (mark.practical + mark.written);
        }
        return res.status(200)
            .json([{ msg: "Student Profile updated successflly", data: {...studentData._doc , totalMakrks}, res: "success" }]);
    }
  } catch(err) {
    return res.status(400).send({
      messge: "Somethig went wrong",
      success: false,
    });
  }
}

const guardianLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const guardianData = await guardian.findOne({ userName, password });
    if(isEmpty(guardianData)) {
      return res.status(400).send({
        messge: "Guardian not found with given login details",
        success: false,
      });
    }
    const fetchStudent = await students.findOne({
      guardian: mongoose.Types.ObjectId(guardianData._id),
    }).populate('guardian').populate('academic');
    if (
      fetchStudent.length === 0 ||
      fetchStudent === undefined ||
      fetchStudent === null ||
      fetchStudent === ""
    ) {
        return res.status(200)
            .json([{ msg: "Student not found!!!", res: "error", }]);
    } else {
        return res.status(200)
            .json([{ msg: "Student Profile", data: fetchStudent, res: "success" }]);
    }
  } catch(err) {
    return res.status(400).send({
      messge: "Somethig went wrong",
      success: false,
    });
  }
}

const addVehicleRoute = async (req, res) => {
  try {
      const { studentId, vehicleRouteId } = req.body;
      const vehicleRouteResponse = await vehicleRouteModel.findOne({_id: mongoose.Types.ObjectId(vehicleRouteId)});
      if (isEmpty(vehicleRouteResponse)) {
          return res.status(400)
              .json([{ msg: "Vehicle Route not found.", res: "error", }]);
      }
      const studentRecord = await students.findOne({_id: mongoose.Types.ObjectId(studentId)});
      if (isEmpty(studentRecord)) {
        return res.status(400)
            .json([{ msg: "Student not found.", res: "error", }]);
      }
      let updateStudent = await students.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(studentId) },
          { $set: { vehicleRoute: vehicleRouteId } }
      );
      if (
        updateStudent.length === 0 ||
        updateStudent === undefined ||
        updateStudent === null ||
        updateStudent === ""
      ) {
          return res.status(200)
              .json([{ msg: "Update Fees in student", res: "error", }]);
      } else {
          const studentsData = await students.findOne({ _id: mongoose.Types.ObjectId(studentId) }).populate({
            path: 'vehicleRoute',
            populate: [
              {path: 'route', model: 'Route'},
              {path: 'vehicle', model: 'Vehicle'},
              {path: 'stoppage', model: 'Stoppage'},
            ]
          }).exec();
          return res.status(200)
              .json([{ msg: "Vehicle Route in Student updated successflly", data: studentsData, res: "success" }]);
      }
  } catch (error) {
      return res.status(400).send({
        messge: "Somethig went wrong",
        success: false,
      });
    }
}

const searchStudentRoutesByAcademics = async (req, res) => {
  try {
      const { academicYear, section, studentClass } = req.body;
      const academicsId = await academicsService.getIdIfAcademicExists({ academicYear, section, studentClass });
      if(!mongoose.Types.ObjectId.isValid(academicsId)) {
          return res.status(400).send({
              messge: "No records found with above filter critera",
              success: false,
          });
      }
      const filteredStudents = await students.find({academic: mongoose.Types.ObjectId(academicsId) }).populate('academic').populate({
        path: 'vehicleRoute',
        populate: [
          {path: 'route', model: 'Route'},
          {path: 'vehicle', model: 'Vehicle'},
          {path: 'stoppage', model: 'Stoppage'},
        ]
      }).exec();
      if (
          filteredStudents !== undefined &&
          filteredStudents.length !== 0 &&
          filteredStudents !== null
      ) {
        return res.status(200).send({
          students: filteredStudents,
          messge: "All Filtered Students",
          success: true,
        });
      } else {
        return res.status(200).send({
          messge: "No Students found with above filtered criteria.",
          success: false,
        });
      }
  } catch(err) {
      return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
      });
  }
}

const removeVehicleRoute = async (req, res) => {
  try {
      const studentId = req.params['studentId'];
      const studentRecord = await students.findOne({_id: mongoose.Types.ObjectId(studentId)});
      if (isEmpty(studentRecord)) {
        return res.status(400)
            .json([{ msg: "Student not found.", res: "error", }]);
      }
      let updateStudent = await students.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(studentId) },
          { $set: { vehicleRoute: null } }
      );
      if (
        updateStudent.length === 0 ||
        updateStudent === undefined ||
        updateStudent === null ||
        updateStudent === ""
      ) {
          return res.status(200)
              .json([{ msg: "Update Transport in student", res: "error", }]);
      } else {
          const studentsData = await students.findOne({ _id: mongoose.Types.ObjectId(studentId) }).populate({
            path: 'vehicleRoute',
            populate: [
              {path: 'route', model: 'Route'},
              {path: 'vehicle', model: 'Vehicle'},
              {path: 'stoppage', model: 'Stoppage'},
            ]
          }).exec();
          return res.status(200)
              .json([{ msg: "Vehicle Route in Student updated successflly", data: studentsData, res: "success" }]);
      }
  } catch (error) {
      return res.status(400).send({
        messge: "Somethig went wrong",
        success: false,
      });
    }
}

const searchByClassYear = async (req, res) => {
  try {
    const { academicYear, studentClass } = req.body;
    if (!academicYear || !studentClass) {
      return res.status(400).send({
        messge: "Please provide valid data",
        success: false,
      });
    }
    const classResponse = await Academics.find({
      academicYear: academicYear,
      studentClass: mongoose.Types.ObjectId(studentClass),
    });
    if (!classResponse || classResponse.length === 0) {
      return res.status(400).send({
        messge: "No records found with above filter critera",
        success: false,
      });
    }
    const academicIds = classResponse.map((item) => item._id);
    const filteredStudents = await students.find({
      academic: { $in: academicIds },
    });
    if (
      filteredStudents !== undefined &&
      filteredStudents.length !== 0 &&
      filteredStudents !== null
    ) {
      return res.status(200).send({
        students: filteredStudents,
        messge: "All Filtered Students",
        success: true,
      });
    } else {
      return res.status(200).send({
        messge: "No Students found with above filtered criteria.",
        success: false,
      });
    }
  } catch (err) {
    return res.status(400).send({
      messge: "Somethig went wrong",
      success: false,
    });
  }
};

module.exports = { uploadImage, createAdmission, createBulkAdmission, getAllStudents, searchByAcademics, remove, removeMultiple, generateCsv, updateStudent, 
  addFeesStructure, searchStudentsFeeByAcademics, updateFeeStatus, fetchStudentsByFilter, fetchStudentsByStatus, updateStatus, promoteStudent, fetchStudentMarks, guardianLogin,
  addVehicleRoute, searchStudentRoutesByAcademics, removeVehicleRoute, getById,searchByClassYear}
