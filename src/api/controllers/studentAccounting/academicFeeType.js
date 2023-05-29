const feeCategory = require("../../models/studentAccounting/feeCategory");
const academicFeeType = require("../../models/studentAccounting/academicFeeType");
const feePlan = require("../../models/studentAccounting/feePlan");
const feeConcession = require("../../models/studentAccounting/feeConcession");
const mongoose = require("mongoose");
const { isEmpty } = require("lodash");
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
        amount: amount[i]['amount'],
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
    const {classId , year } = req.body;
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

// create fee plan
const createFeePlan = async (req, res) => {
  try {
    const { date, type } = req.body;
    if (isEmpty(date)) {
      return res.status(400).send({
        messge: "Date is required",
        success: false,
      });
    }
    if (isEmpty(type)) {
      return res.status(400).send({
        messge: "Type is required",
        success: false,
      });
    }
    const data = [];
    const dateArray = date.split(",");
    for (let i = 0; i < dateArray.length; i++) {
      data.push({ date: dateArray[i], status: false });
    }
    const newFeePlan = await feePlan.create({
      date: data,
      frequency: type,
    });
    if (newFeePlan) {
      return res.status(200).json({
        newFeePlan,
        message: "Fee Plan Created Successfully",
        success: true,
      });
    } else {
      return res.status(400).send({
        messge: "Fee Plan Creation Failed",
        success: false,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json([{ msg: err.message, res: "error", success: false }]);
  }
};

// get all fee plan
const getAllFeePlan = async (req, res) => {
  try {
    const feePlanList = await feePlan.find().select("-__v");
    if (isEmpty(feePlanList)) {
      return res.status(400).send({
        messge: "No Fee Plan Found",
        success: false,
      });
    } else {
      return res.status(200).json({
        feePlanList,
        message: "Fee Plan List",
        success: true,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json([{ msg: err.message, res: "error", success: false }]);
  }
};
// get all fee plan
const allPlans = async (req, res) => {
  try {
    const feePlanList = await feePlan.find().select("-__v -date");
    if (isEmpty(feePlanList)) {
      return res.status(400).send({
        messge: "No Fee Plan Found",
        success: false,
      });
    } else {
      return res.status(200).json({
        feePlanList,
        message: "Fee Plan List",
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
// const createFeeConcession = async (req, res) => {
//   try {
//     const { studentId, feemode,academicFeeTypeId,feeCatId,concession } = req.body;
//     if (isEmpty(studentId)) {
//       return res.status(400).send({
//         messge: "Student Id is required",
//         success: false,
//       });
//     }
//     if (isEmpty(feemode)) {
//       return res.status(400).send({
//         messge: "Fee Mode is required",
//         success: false,
//       });
//     }
//     if (isEmpty(academicFeeTypeId)) {
//       return res.status(400).send({
//         messge: "Academic Fee Type Id is required",
//         success: false,
//       });
//     }
//     if (isEmpty(feeCatId)) {
//       return res.status(400).send({
//         messge: "Fee Category Id is required",
//         success: false,
//       });
//     }
//     if (isEmpty(concession)) {
//       return res.status(400).send({
//         messge: "Concession is required",
//         success: false,
//       });
//     }
//     const studentData = await students.findById({ _id: studentId });
//     console.log(studentData)
//     if (studentData) {
//       const academicFeeTypeData = await academicFeeType.findById({
//         _id: academicFeeTypeId,
//       });
//       if (academicFeeTypeData) {
//         const feeCategoryData = academicFeeTypeData.feeCategory.find(
//           (item) => item.id == feeCatId,
//           console.log(feeCategoryData)
//         );
//         // if (feeCategoryData) {
//         //   const amount = feeCategoryData.amount;
//         //   const concessionAmount = (amount * concession) / 100;
//         //   const total = amount - concessionAmount;
//         //   console.log(total);
//         // } else {
//         //   return res.status(400).send({
//         //     messge: "Fee Category Not Found",
//         //     success: false,
//         //   });
//         // }
//       } else {
//         return res.status(400).send({
//           messge: "Academic Fee Type Not Found",
//           success: false,
//         });
//       }
//     } else {
//       return res.status(400).send({
//         messge: "Student Not Found",
//         success: false,
//       });
//     }
//   } catch (err) {
//     return res
//       .status(400)
//       .json([{ msg: err.message, res: "error", success: false }]);
//   }
// };





module.exports = {
  create,
  getAll,
  getYearWise,
  getClassandYearWise,
  createFeePlan,
  getAllFeePlan,
  allPlans,
  getConcessionAmount,
  // createFeeConcession
};
