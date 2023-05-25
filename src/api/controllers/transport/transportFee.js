const TransportFee = require("../../models/transport/transportFee");
const mongoose = require("mongoose");
const { isEmpty } = require("lodash");

// create transport fee
const create = async (req, res) => {
  try {
    const { year, distance, amount } = req.body;
    if (isEmpty(year) || isEmpty(distance) || isEmpty(amount)) {
      return res.status(400).send({
        messge: "Mandatory fields missing while creating Transport Fee",
        success: false,
      });
    }
    const code = `TRANS-${distance}` + "KM";
    const newTransportFee = await TransportFee.create({
      year,
      distance,
      amount,
      code: code,
    });
    return res.status(200).json({
      transportFee: newTransportFee,
      message: "Added New Transport Fee Successfully",
      success: true,
    });
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

// get all transport fee
const getAll = async (req, res) => {
  try {
    const transportFee = await TransportFee.find().select("-__v -createdAt");
    if (!transportFee) {
      return res.status(400).json({
        message: "No Transport Fee Found",
        success: false,
      });
    } else {
      return res.status(200).json({
        transportFee: transportFee,
        message: "All Transport Fee",
        success: true,
      });
    }
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

// update transport fee
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, distance, amount } = req.body;
    if (isEmpty(id) || isEmpty(year) || isEmpty(distance) || isEmpty(amount)) {
      return res.status(400).send({
        messge: "Mandatory fields missing while creating Transport Fee",
        success: false,
      });
    }
    const code = `TRANS-${distance}` + "KM";
    const updateTransportFee = await TransportFee.findByIdAndUpdate(
      id,
      {
        year,
        distance,
        amount,
        code: code,
      },
      { new: true }
    );
    return res.status(200).json({
      transportFee: updateTransportFee,
      message: "Updated Transport Fee Successfully",
      success: true,
    });
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

// delete transport fee
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        if (isEmpty(id)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while deleting Transport Fee",
                success: false,
            });
        }
        const deleteTransportFee = await TransportFee.findByIdAndDelete(id);
        return res.status(200).json({
            transportFee: deleteTransportFee,
            message: "Deleted Transport Fee Successfully",
            success: true,
        });
    } catch (err) {
        return res.status(400).json([{ msg: err.message, res: "error" }]);
    }
};

module.exports = { create, getAll,update,remove };
