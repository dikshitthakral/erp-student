const feeType = require('../../models/studentAccounting/feeType');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const create = async (req, res) => {
    try {
        const { name, code, amount, dueDate, description } = req.body;
        if(isEmpty(name) || isEmpty(code) || Number(amount) === 0 || isEmpty(dueDate)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating FeeType.",
                success: false,
            });
        }
        const newFeeType = await feeType.create({
            name,
            code,
            amount,
            dueDate,
            description : isEmpty(description) ? undefined : description
        });
        return res.status(200).json({
            feeType: newFeeType,
            message: "Added New FeeType Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allFeeTypes = await feeType.find();
        if (
            allFeeTypes !== undefined &&
            allFeeTypes.length !== 0 &&
            allFeeTypes !== null
        ) {
          return res.status(200).send({
            feeTypes: allFeeTypes,
            messge: "All FeeTypes",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "FeeTypes does not exist",
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

const getById = async (req, res) => {
  try {
      const id = req.params['id'];
      if (!id) {
        return res.status(200).json({
          message: "FeeType Id not found",
          success: false,
        });
      } 
      let feeTypeResult = await feeType.findOne({ _id: id});
      if (
        feeTypeResult !== undefined &&
        feeTypeResult !== null
      ) {
        return res.status(200).send({
          feeType: feeTypeResult,
          messge: "Get FeeType by Id successfully",
          success: true,
        });
      } else {
        return res.status(200).send({
          messge: "FeeType by id does not exist",
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

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
          return res.status(200).json({
            message: "FeeType Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteFeeType = await feeType.deleteOne({ _id: id });
          if (
            deleteFeeType["deletedCount"] === 0 ||
            deleteFeeType === null ||
            deleteFeeType === undefined
          ) {
            return res.status(404).json({
              id,
              message: "FeeType Not found ",
              success: true,
            });
          } else if (
            deleteFeeType["deletedCount"] === 1 &&
            deleteFeeType !== null &&
            deleteFeeType !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Fee Type Deleted Successfully !!! ",
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
        const { feeTypeId, name, code, amount, dueDate, description } = req.body;
        const updateObject = {}
        if(!isEmpty(name)) { updateObject["name"] = name; }
        if(!isEmpty(code)) { updateObject["code"] = code; }
        if(!isEmpty(amount)) { updateObject["amount"] = amount; }
        if(!isEmpty(dueDate)) { updateObject["dueDate"] = dueDate; }
        if(!isEmpty(description)) { updateObject["description"] = description; }
        let updateFeeType = await feeType.findOneAndUpdate(
            { _id: feeTypeId },
            {
                $set: updateObject
            }
        );
        if (
            updateFeeType.length === 0 ||
            updateFeeType === undefined ||
            updateFeeType === null ||
            updateFeeType === ""
        ) {
            return res.status(200)
                .json([{ msg: "FeeType not found!!!", res: "error", }]);
        } else {
            const feeTypeData = await feeType.findOne({ _id: feeTypeId })
            return res.status(200)
                .json([{ msg: "FeeType updated successflly", data: feeTypeData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { create, getAll, remove, update, getById};