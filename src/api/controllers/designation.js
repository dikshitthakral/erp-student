const designation = require('../models/designation');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
          return res.status(200).json({
            message: "Designation Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteDesignation = await designation.deleteOne({ _id: id });
          if (
            deleteDesignation["deletedCount"] === 0 ||
            deleteDesignation === null ||
            deleteDesignation === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Designation Not found ",
              success: true,
            });
          } else if (
            deleteDesignation["deletedCount"] === 1 &&
            deleteDesignation !== null &&
            deleteDesignation !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Designation Deleted Successfully !!! ",
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

const create = async (req, res) => {
    try {
        const {
            name,
           description
          } = req.body;
          const newDesignation = await designation.create({
            name,
            description:  isEmpty(description) ? undefined : description
          });
          return res.status(200).json({
            designation: newDesignation,
            message: "Added New Designation Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allDesignations = await designation.find();
        if (
            allDesignations !== undefined &&
            allDesignations.length !== 0 &&
            allDesignations !== null
        ) {
          return res.status(200).send({
            designations: allDesignations,
            messge: "All Designation",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Designation does not exist",
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

const update = async (req, res) => {
    try {
        const {
            id,
            name,
           description
          } = req.body;
          const updateObj = {
            'name' : isEmpty(name) ? undefined : name,
            'description': isEmpty(description) ? undefined : description
          }
        let updateDesignation = await designation.findOneAndUpdate(
            { _id: id },
            {
                $set: updateObj
            }
        );
        if (
            updateDesignation.length === 0 ||
            updateDesignation === undefined ||
            updateDesignation === null ||
            updateDesignation === ""
        ) {
            return res.status(200)
                .json([{ msg: "Designation not found!!!", res: "error", }]);
        } else {
            const designationData = await designation.findOne({ _id: id })
            return res.status(200)
                .json([{ msg: "Designation updated successflly", data: designationData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { remove, create, getAll, update }