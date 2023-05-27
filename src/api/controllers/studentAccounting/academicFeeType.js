const feeCategory = require("../../models/studentAccounting/feeCategory");
const academicFeeType = require("../../models/studentAccounting/academicFeeType");
const mongoose = require("mongoose");
const { isEmpty } = require("lodash");

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

module.exports = { create, getAll, getYearWise };
