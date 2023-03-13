const feeGroup = require('../../models/studentAccounting/feeGroup');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const create = async (req, res) => {
    try {
        const { name, feeTypes, description } = req.body;
        if(isEmpty(name) || isEmpty(feeTypes)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating FeeGroup.",
                success: false,
            });
        }
        const newFeeGroup = await feeGroup.create({
            name,
            feeTypes : feeTypes.length > 0 ? feeTypes : [],
            description : isEmpty(description) ? undefined : description
        });
        return res.status(200).json({
            feeGroup: newFeeGroup,
            message: "Added New FeeGroup Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allFeeGroup = await feeGroup.find().populate('feeTypes');
        if (
            allFeeGroup !== undefined &&
            allFeeGroup.length !== 0 &&
            allFeeGroup !== null
        ) {
          return res.status(200).send({
            feeGroups: allFeeGroup,
            messge: "All FeeGroups",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "FeeGroups does not exist",
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
            message: "FeeGroup Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteFeeGroup = await feeGroup.deleteOne({ _id: id });
          if (
            deleteFeeGroup["deletedCount"] === 0 ||
            deleteFeeGroup === null ||
            deleteFeeGroup === undefined
          ) {
            return res.status(404).json({
              id,
              message: "FeeGroup Not found ",
              success: true,
            });
          } else if (
            deleteFeeGroup["deletedCount"] === 1 &&
            deleteFeeGroup !== null &&
            deleteFeeGroup !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Fee Group Deleted Successfully !!! ",
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
        const { feeGroupId, name, feeTypes, description } = req.body;
        const updateObject = {}
        if(!isEmpty(name)) { updateObject["name"] = name; }
        if(!isEmpty(feeTypes) && feeTypes.length > 0) { updateObject["feeTypes"] = feeTypes; }
        if(!isEmpty(description)) { updateObject["description"] = description; }
        let updateFeeGroup = await feeGroup.findOneAndUpdate(
            { _id: feeGroupId },
            {
                $set: updateObject
            }
        );
        if (
            updateFeeGroup.length === 0 ||
            updateFeeGroup === undefined ||
            updateFeeGroup === null ||
            updateFeeGroup === ""
        ) {
            return res.status(200)
                .json([{ msg: "FeeGroup not found!!!", res: "error", }]);
        } else {
            const feeGroupData = await feeGroup.findOne({ _id: feeGroupId })
            return res.status(200)
                .json([{ msg: "FeeGroup updated successflly", data: feeGroupData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

const addFeeType = async (req, res) => {
    try {
        const { feeGroupId, feeType } = req.body;
        const feeGroupData = await feeGroup.findOne({ _id: feeGroupId });
        if (!isEmpty(feeGroupData)) {
            return res.status(400)
                .json([{ msg: "FeeGroup not found.", res: "error", }]);
        }
        let updateFeeGroup = await feeGroup.findOneAndUpdate(
            { _id: feeGroupId },
            { $push: { feeTypes: feeType } }
        );
        if (
            updateFeeGroup.length === 0 ||
            updateFeeGroup === undefined ||
            updateFeeGroup === null ||
            updateFeeGroup === ""
        ) {
            return res.status(200)
                .json([{ msg: "Update FeeType in FeeGroup.", res: "error", }]);
        } else {
            const feeGroupData = await feeGroup.findOne({ _id: feeGroupId }).populate('feeTypes');
            return res.status(200)
                .json([{ msg: "FeeType in FeeGroup updated successflly", data: feeGroupData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

const removeFeeType = async (req, res) => {
    try {
        const { feeGroupId, feeType } = req.body;
        const feeGroupData = await feeGroup.findOne({ _id: feeGroupId });
        if (!isEmpty(feeGroupData)) {
            return res.status(400)
                .json([{ msg: "FeeGroup not found.", res: "error", }]);
        }
        let updateFeeGroup = await feeGroup.findOneAndUpdate(
            { _id: feeGroupId },
            { $pull: { feeTypes: feeType } }
        );
        if (
            updateFeeGroup.length === 0 ||
            updateFeeGroup === undefined ||
            updateFeeGroup === null ||
            updateFeeGroup === ""
        ) {
            return res.status(200)
                .json([{ msg: "Update FeeType in FeeGroup.", res: "error", }]);
        } else {
            const feeGroupData = await feeGroup.findOne({ _id: feeGroupId }).populate('feeTypes');
            return res.status(200)
                .json([{ msg: "FeeType in FeeGroup updated successflly", data: feeGroupData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { create, getAll, remove, update, addFeeType, removeFeeType};