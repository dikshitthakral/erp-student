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
        messge: "Academic amount validation failed if field is empty send null value",
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

module.exports = { create, getAll };
