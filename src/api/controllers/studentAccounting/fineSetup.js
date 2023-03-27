const fineSetup = require('../../models/studentAccounting/fineSetup');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const create = async (req, res) => {
    try {
        const { fineType, feeType, fineValue,lateFeeFrequency} = req.body;
        if(isEmpty(feeType) || isNaN(fineValue)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating FineSetup.",
                success: false,
            });
        }
        const newFine = await fineSetup.create({
            feeType,
            fineValue : Number(fineValue),
            fineType : isEmpty(fineType) ? undefined : fineType,
            lateFeeFrequency : isEmpty(lateFeeFrequency) ? undefined : lateFeeFrequency
        });
        return res.status(200).json({
            fineSetup: newFine,
            message: "Added New Fine Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allFineSetup = await fineSetup.find().populate('feeType');
        if (
            allFineSetup !== undefined &&
            allFineSetup.length !== 0 &&
            allFineSetup !== null
        ) {
          return res.status(200).send({
            fines: allFineSetup,
            messge: "All Fines",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Fines does not exist",
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
          message: "Fine Setup Id not found",
          success: false,
        });
      } 
      let fineSetupResult = await fineSetup.findOne({ _id: id}).populate('feeType');
      if (
        fineSetupResult !== undefined &&
        fineSetupResult.length !== 0 &&
        fineSetupResult !== null
      ) {
        return res.status(200).send({
          fineSetup: fineSetupResult,
          messge: "Get Fine by Id successfully",
          success: true,
        });
      } else {
        return res.status(200).send({
          messge: "Fine by id does not exist",
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
            message: "Fine setup Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteFine = await fineSetup.deleteOne({ _id: id });
          if (
            deleteFine["deletedCount"] === 0 ||
            deleteFine === null ||
            deleteFine === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Fine Not found ",
              success: true,
            });
          } else if (
            deleteFine["deletedCount"] === 1 &&
            deleteFine !== null &&
            deleteFine !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Fine Deleted Successfully !!! ",
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
        const { fineSetupId, fineType, feeType, fineValue, lateFeeFrequency } = req.body;
        const updateObject = {}
        if(!isEmpty(fineType)) { updateObject["fineType"] = fineType; }
        if(!isEmpty(feeType)) { updateObject["feeType"] = feeType; }
        if(!isNaN(fineValue)) { updateObject["fineValue"] = Number(fineValue); }
        if(!isEmpty(lateFeeFrequency)) { updateObject["lateFeeFrequency"] = lateFeeFrequency; }
        let updateFineSetup = await fineSetup.findOneAndUpdate(
            { _id: fineSetupId },
            {
                $set: updateObject
            }
        );
        if (
            updateFineSetup.length === 0 ||
            updateFineSetup === undefined ||
            updateFineSetup === null ||
            updateFineSetup === ""
        ) {
            return res.status(200)
                .json([{ msg: "Fine Setup not found!!!", res: "error", }]);
        } else {
            const fineSetupData = await fineSetup.findOne({ _id: fineSetupId })
            return res.status(200)
                .json([{ msg: "Fine Setup updated successflly", data: fineSetupData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { create, getAll, remove, update, getById };