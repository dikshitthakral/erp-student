const feePlan = require("../../models/studentAccounting/feePlan");
const feeMonth = require("../../models/studentAccounting/feeMonth");
const mongoose = require("mongoose");
const { isEmpty, merge } = require("lodash");
// create fee month type
const createMonthType = async (req, res) => {
  try {
    const { type } = req.body;
    if (isEmpty(type)) {
      return res.status(400).send({
        messge: "Type is required",
        success: false,
      });
    }
    const newFeeType = await feePlan.create({
      frequency: type,
    });
    if (newFeeType) {
      return res.status(200).json({
        newFeeType,
        message: "Fee Type Created Successfully",
        success: true,
      });
    } else {
      return res.status(400).send({
        messge: "Fee Type Creation Failed",
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
const allMode = async (req, res) => {
  try {
    const allMode = await feePlan.find().select("-__v -createdAt");
    if (isEmpty(allMode)) {
      return res.status(400).send({
        messge: "No Fee Mode Found",
        success: false,
      });
    } else {
      return res.status(200).json({
        allMode,
        message: "Fee Mode List",
        success: true,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json([{ msg: err.message, res: "error", success: false }]);
  }
};

// create fee month
const createFeeMonth = async (req, res) => {
  try {
    const { id, month, date, status } = req.body;
    if (isEmpty(id)) {
      return res.status(400).send({
        messge: "Fee Mode Id is required",
        success: false,
      });
    }
    if (isEmpty(month)) {
      return res.status(400).send({
        messge: "Month is required",
        success: false,
      });
    }
    if (isEmpty(date)) {
      return res.status(400).send({
        messge: "Date is required",
        success: false,
      });
    }
    const newFeeMonth = await feeMonth.create({
      modeId: id,
      month: month,
      date: date,
    });
    if (newFeeMonth) {
      return res.status(200).json({
        newFeeMonth,
        message: "Fee Month Created Successfully",
        success: true,
      });
    } else {
      return res.status(400).send({
        messge: "Fee Month Creation Failed",
        success: false,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json([{ msg: err.message, res: "error", success: false }]);
  }
};

// get all fee month by mode id
const allFeeMonth = async (req, res) => {
    try {
        const { id } = req.params;
        if (isEmpty(id)) {
            return res.status(400).send({
                messge: "Fee Mode Id is required",
                success: false,
            });
        }
        const allFeeMonth = await feeMonth.find({ modeId: id }).select("-__v -createdAt");
        if (isEmpty(allFeeMonth)) {
            return res.status(400).send({
                messge: "No Fee Month Found",
                success: false,
            });
        } else {
            return res.status(200).json({
                allFeeMonth,
                message: "Fee Month List",
                success: true,
            });
        }
    } catch (err) {
        return res
            .status(400)
            .json([{ msg: err.message, res: "error", success: false }]);
    }
};


module.exports = {
  createMonthType,
  allMode,
  createFeeMonth,
  allFeeMonth
};
