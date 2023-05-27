const feeCategory = require("../../models/studentAccounting/feeCategory");
const mongoose = require("mongoose");
const { isEmpty } = require("lodash");

const createFeeCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (isEmpty(categoryName)) {
      return res.status(400).send({
        messge: "Mandatory fields missing while creating FeeCategory",
        success: false,
      });
    }
    const code =
      categoryName.toUpperCase().replace(/\s/g, "_") +
      "_" +
      new Date().getFullYear();
    const newFeeCategory = await feeCategory.create({
      categoryName,
      code: code,
    });
    return res.status(200).json({
      feeGroup: newFeeCategory,
      message: "Added New FeeCategory Successfully",
      success: true,
    });
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

// get all feeCategory
const getAllFeeCategory = async (req, res) => {
  try {
    const allData = await feeCategory.find();
    return res.status(200).json({
      allData,
      message: "FeeCategory List",
      success: true,
    });
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

// delete feeCategory by id
const deleteFeeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json([{ msg: "FeeCategory Id is not valid", success: false }]);
    }
    const deleteFeeCategory = await feeCategory.findByIdAndDelete(id);
    return res.status(200).json({
      deleteFeeCategory,
      message: "FeeCategory Deleted Successfully",
      success: true,
    });
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

// update feeCategory by id
const updateFeeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json([{ msg: "FeeCategory Id is not valid", success: false }]);
        }
        if (isEmpty(categoryName)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while updating FeeCategory",
                success: false,
            });
            
        } 
        const updateFeeCategory = await feeCategory.findByIdAndUpdate(id, { categoryName: categoryName }, { new: true });
        return res.status(200).json({
            updateFeeCategory,
            message: "FeeCategory Updated Successfully",
            success: true,
        });
    } catch (err) {
        return res.status(400).json([{ msg: err.message, res: "error" }]);
    }
};

// create academic year 
  const createAcademicYear = async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();
      const academicYearList = [];
      for (let i = 0; i < 3; i++) {
        const year = currentYear + i;
        const nextYear = year + 1;
        const academicYear = year + "-" + nextYear;
        academicYearList.push({"year":academicYear});
      }
      return res.status(200).json({
        academicYearList,
        message: "All Academic Year Successfully",
        success: true,
      });

    } catch (err) {
      return res.status(400).json([{ msg: err.message, res: "error" }]);
    }
  };


module.exports = { createFeeCategory, getAllFeeCategory,deleteFeeCategory,updateFeeCategory,createAcademicYear };
