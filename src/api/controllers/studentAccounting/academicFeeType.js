const feeCategory = require("../../models/studentAccounting/feeCategory");
const academicFeeType = require("../../models/studentAccounting/academicFeeType");
const feePlan = require("../../models/studentAccounting/feePlan");
const feeConcession = require("../../models/studentAccounting/feeConcession");
const mongoose = require("mongoose");
const { isEmpty, merge } = require("lodash");
const students = require("../../models/students");

const create = async (req, res) => {
  try {
    const { classId, year, amount } = req.body;
    if (isEmpty(classId) || isEmpty(year) || isEmpty(amount)) {
      return res.status(400).send({
        messge: "Mandatory fields missing while creating Academic Fee Type",
        success: false,
      });
    }
    const data = [];
    const feeCategoryList = await feeCategory.find();
    if (feeCategoryList.length !== amount.length) {
      return res.status(400).send({
        messge:
          "Academic amount validation failed if field is empty send null value",
        success: false,
      });
    }
    for (let i = 0; i < feeCategoryList.length; i++) {
      data.push({
        id: feeCategoryList[i]._id,
        categoryName: feeCategoryList[i].categoryName,
        code: feeCategoryList[i].code,
        amount: amount[i],
      });
    }
    const academicFeeTypeData = await academicFeeType.findOne({
      class: classId,
      year,
    });
    if (academicFeeTypeData) {
      const updateAcademicFeeType = await academicFeeType.findOneAndUpdate(
        { class: classId, year },
        { feeCategory: data },
        { new: true }
      );
      return res.status(200).json({
        academicFeeType: updateAcademicFeeType,
        message: "Updated Academic Fee Type Successfully",
        success: true,
      });
    } else {
      const newAcademicFeeType = await academicFeeType.create({
        class: classId,
        year,
        feeCategory: data,
      });
      return res.status(200).json({
        academicFeeType: newAcademicFeeType,
        message: "Added New Academic Fee Type Successfully",
        success: true,
      });
    }
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

// get all academic fee type
const getAll = async (req, res) => {
  try {
    const academicFeeTypeList = await academicFeeType
      .find()
      .populate("class", "className classNumeric")
      .populate("feeCategory.id", "categoryName code");
    return res.status(200).json({
      academicFeeTypeList,
      message: "Academic Fee Type List",
      success: true,
    });
  } catch (err) {
    return res
      .status(400)
      .json([{ msg: err.message, res: "error", success: false }]);
  }
};
// year wise academic fee type
const getYearWise = async (req, res) => {
  try {
    const { year } = req.body;
    if (isEmpty(year)) {
      return res.status(400).send({
        messge: "Academic year is required",
        success: false,
      });
    }
    const data = await academicFeeType
      .find({ year: year })
      .populate("class", "className classNumeric")
      .select("-createdAt -__v");
    if (isEmpty(data)) {
      return res.status(400).send({
        messge: "No Academic Fee Type Found",
        success: false,
      });
    } else {
      return res.status(200).json({
        data,
        message: "Academic Fee Type List",
        success: true,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json([{ msg: err.message, res: "error", success: false }]);
  }
};
//get data class and  year wise academic fee type
const getClassandYearWise = async (req, res) => {
  try {
    const { classId, year } = req.body;
    if (isEmpty(classId)) {
      return res.status(400).send({
        messge: "ClassId is required",
        success: false,
      });
    }
    if (isEmpty(year)) {
      return res.status(400).send({
        messge: "Academic year is required",
        success: false,
      });
    }
    const data = await academicFeeType
      .find({ year: year, class: classId })
      .select("-createdAt -__v");
    if (isEmpty(data)) {
      return res.status(400).send({
        messge: "No Academic Fee Type Found",
        success: false,
      });
    } else {
      return res.status(200).json({
        data,
        message: "Academic Fee Type List",
        success: true,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json([{ msg: err.message, res: "error", success: false }]);
  }
};

// get concession amount
const getConcessionAmount = async (req, res) => {
  try {
    const { academicId, feeCatId, concession } = req.body;
    if (isEmpty(academicId)) {
      return res.status(400).send({
        messge: "Academic Id is required",
        success: false,
      });
    }
    if (isEmpty(feeCatId)) {
      return res.status(400).send({
        messge: "Fee Category Id is required",
        success: false,
      });
    }
    if (isEmpty(concession)) {
      return res.status(400).send({
        messge: "Concession is required",
        success: false,
      });
    }

    const academicFeeTypeData = await academicFeeType.findById({
      _id: academicId,
    });
    if (academicFeeTypeData) {
      const feeCategoryData = academicFeeTypeData.feeCategory.find(
        (item) => item.id == feeCatId
      );
      if (feeCategoryData) {
        const amount = feeCategoryData.amount;
        const concessionAmount = (amount * concession) / 100;
        const total = amount - concessionAmount;
        return res.status(200).json({
          amount,
          concessionAmount,
          total,
          message: "Amount Calculated Successfully",
          success: true,
        });
      } else {
        return res.status(400).send({
          messge: "Fee Category Not Found",
          success: false,
        });
      }
    } else {
      return res.status(400).send({
        messge: "Academic Fee Type Not Found",
        success: false,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json([{ msg: err.message, res: "error", success: false }]);
  }
};

// create fee concession to student
const createFeeConcession = async (req, res) => {
  try {
    const { studentId, feemode, academicYear, studentClass, totalFinalAmount,allFee } =
      req.body;
    if (isEmpty(studentId)) {
      return res.status(400).send({
        messge: "Student Id is required",
        success: false,
      });
    }
    if (isEmpty(feemode)) {
      return res.status(400).send({
        messge: "Fee Mode id is required",
        success: false,
      });
    }
    if (isEmpty(academicYear)) {
      return res.status(400).send({
        messge: "Academic Year is required",
        success: false,
      });
    }
    if (isEmpty(studentClass)) {
      return res.status(400).send({
        messge: "student class id is required",
        success: false,
      });
    }
    if (isEmpty(totalFinalAmount)) {
      return res.status(400).send({
        messge: "totalFinalAmount is required",
        success: false,
      });
    }
    if (isEmpty(allFee)) {
      return res.status(400).send({
        messge: "allFee is required",
        success: false,
      });
    }
    const studentData = await students.findById({ _id: studentId });
    if (studentData) {
      const FeeMode = await feePlan.findById({ _id: feemode });
      if (FeeMode) {
        const feeConcessionData = await feeConcession.create({
          studentId: studentId,
          feemode: feemode,
          academicYear: academicYear,
          studentClass: studentClass,
          totalFinalAmount: totalFinalAmount,
          allFee:allFee
        });
        if (feeConcessionData) {
          return res.status(200).json({
            feeConcessionData,
            message: "Fee Concession Created Successfully",
            success: true,
          });
        } else {
          return res.status(400).send({
            messge: "Fee Concession Not Created",
            success: false,
          });
        }
      } else {
        return res.status(400).send({
          messge: "Fee Mode Not Found",
          success: false,
        });
      }
    } else {
      return res.status(400).send({
        messge: "Student Not Found",
        success: false,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json([{ msg: err.message, res: "error", success: false }]);
  }
};

// get fee details by student id
const feeDtailByStudentID = async (req, res) => {
  try {
    const { id } = req.params;
    if (isEmpty(id)) {
      return res.status(400).send({
        messge: "Student Id is required",
        success: false,
      });
    }
    const studentData = await students.findById({ _id: id });
    if (studentData) {
        const feeDetails = await feeConcession.find({ studentId: id });
        if (feeDetails) {
          return res.status(200).json({
            feeDetails,
            message: "Fee Details Get Successfully",
            success: true,
          });
        } else {
          return res.status(400).send({
            messge: "Fee Details Not Found",
            success: false,
          });
        }
    } else {
      return res.status(400).send({
        messge: "Student Not Found",
        success: false,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json([{ msg: err.message, res: "error", success: false }]);
  }
};

// get fee detail by id
const getFeeDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isEmpty(id)) {
      return res.status(400).send({
        messge: "Id is required",
        success: false,
      });
    }
    const feeDetails = await feeConcession.findById({ _id: id });
    if (feeDetails) {
      return res.status(200).json({
        feeDetails,
        message: "Fee Details Get Successfully",
        success: true,
      });
    } else {
      return res.status(400).send({
        messge: "Fee Details Not Found",
        success: false,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json([{ msg: err.message, res: "error", success: false }]);
  }
};
module.exports = {
  create,
  getAll,
  getYearWise,
  getClassandYearWise,
  getConcessionAmount,
  createFeeConcession,
  feeDtailByStudentID,
  getFeeDetailById,
};
