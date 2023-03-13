const leavesCategory = require('../../models/humanResources/leavesCategory');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const create = async (req, res) => {
    try {
        const { name, days, designation } = req.body;
        if(isEmpty(name) || Number(days) === 0 || isEmpty(designation)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating Leaves Category.",
                success: false,
            });
        }
        const newLeavesCategory = await leavesCategory.create({
            name,
            days,
            designation
        });
        return res.status(200).json({
            leavescategory: newLeavesCategory,
            message: "Added New Leaves Category Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allLeavesCategory = await leavesCategory.find();
        if (
            allLeavesCategory !== undefined &&
            allLeavesCategory.length !== 0 &&
            allLeavesCategory !== null
        ) {
          return res.status(200).send({
            leavesCategory: allLeavesCategory,
            messge: "All Leaves Category",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Leaves Category does not exist",
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
            message: "Leaves Category Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteLeavesCategory = await leavesCategory.deleteOne({ _id: id });
          if (
            deleteLeavesCategory["deletedCount"] === 0 ||
            deleteLeavesCategory === null ||
            deleteLeavesCategory === undefined
          ) {
            return res.status(404).json({
              id,
              message: "leaves Category Not found ",
              success: true,
            });
          } else if (
            deleteLeavesCategory["deletedCount"] === 1 &&
            deleteLeavesCategory !== null &&
            deleteLeavesCategory !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Leaves Category Deleted Successfully !!! ",
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
        const { leavesCategoryId , name, days, designation } = req.body;
        const updateObject = {}
        if(!isEmpty(name)) { updateObject["name"] = name; }
        if(!isNaN(days)) { updateObject["days"] = days; }
        if(!isEmpty(designation)) { updateObject["designation"] = designation; }
        let updateLeavesCategory = await leavesCategory.findOneAndUpdate(
            { _id: leavesCategoryId },
            {
                $set: updateObject
            }
        );
        if (
            updateLeavesCategory.length === 0 ||
            updateLeavesCategory === undefined ||
            updateLeavesCategory === null ||
            updateLeavesCategory === ""
        ) {
            return res.status(200)
                .json([{ msg: "LeavesCategory not found!!!", res: "error", }]);
        } else {
            const leavesCategoryData = await leavesCategory.findOne({ _id: leavesCategoryId })
            return res.status(200)
                .json([{ msg: "LeavesCategory updated successflly", data: leavesCategoryData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { create, getAll, remove, update };