const marksDistribution = require('../models/marksDistribution');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const create = async (req, res) => {
    try {
        const { name, branch } = req.body;
        if(isEmpty(name)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating marks Distribution.",
                success: false,
            });
        }
        const newMarksDistribution = await marksDistribution.create({
            name,
            branch
        });
        return res.status(200).json({
            marksDistribution: newMarksDistribution,
            message: "Added New Marks Distribution Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allMarksDistribution = await marksDistribution.find();
        if (
            allMarksDistribution !== undefined &&
            allMarksDistribution.length !== 0 &&
            allMarksDistribution !== null
        ) {
          return res.status(200).send({
            marksDistributions: allMarksDistribution,
            messge: "All Marks Distribution",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Marks Distribution does not exist",
            success: false,
          });
        }
      } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
          return res.status(200).json({
            message: "Marks Distribution Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteMarksDistribution = await marksDistribution.deleteOne({ _id: id });
          if (
            deleteMarksDistribution["deletedCount"] === 0 ||
            deleteMarksDistribution === null ||
            deleteMarksDistribution === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Marks Distribution Not found ",
              success: true,
            });
          } else if (
            deleteMarksDistribution["deletedCount"] === 1 &&
            deleteMarksDistribution !== null &&
            deleteMarksDistribution !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Marks Distribution Deleted Successfully !!! ",
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
        const { marksDistributionId, name, branch } = req.body;
        const updateObject = {}
        if(!isEmpty(name)) { updateObject["name"] = name; }
        if(!isEmpty(branch)) { updateObject["branch"] = branch; }
        let updateMarksDistribution = await marksDistribution.findOneAndUpdate(
            { _id: marksDistributionId },
            {
                $set: updateObject
            }
        );
        if (
            updateMarksDistribution.length === 0 ||
            updateMarksDistribution === undefined ||
            updateMarksDistribution === null ||
            updateMarksDistribution === ""
        ) {
            return res.status(200)
                .json([{ msg: "Marks Distribution not found!!!", res: "error", }]);
        } else {
            const marksDistributionData = await marksDistribution.findOne({ _id: marksDistributionId })
            return res.status(200)
                .json([{ msg: "Marks Distribution updated successflly", data: marksDistributionData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { create, getAll, remove, update};