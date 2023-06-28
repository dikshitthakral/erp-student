const type = require('../models/type');
const mongoose = require('mongoose');
const { isEmpty, isNumber } = require('lodash');

const create = async (req, res) => {
    try {
        const { name } = req.body;
        if(isEmpty(name)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating type",
                success: false,
            });
        }
        const newType = await type.create({
            name
        });
        return res.status(200).json({
            section: newType,
            message: "Added New Type Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allType = await type.find();
        if (
            allType !== undefined &&
            allType.length !== 0 &&
            allType !== null
        ) {
          return res.status(200).send({
            sections: allType,
            message: "All Type",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Type does not exist",
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
            message: "Type Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteType = await type.deleteOne({ _id: id });
          if (
            deleteType["deletedCount"] === 0 ||
            deleteType === null ||
            deleteType === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Type Not found ",
              success: true,
            });
          } else if (
            deleteType["deletedCount"] === 1 &&
            deleteType !== null &&
            deleteType !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Type Deleted Successfully !!! ",
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
        const { typeId, name } = req.body;
        if (isEmpty(typeId)) {
            return res.status(400)
                .json([{ msg: "Type not found.", res: "error", }]);
        }
        if (isEmpty(name)) {
            return res.status(400)
                .json([{ msg: "type name is required", res: "error", }]);
        }

        let updateType = await type.findOneAndUpdate(
            { _id: typeId },
            { $set: { name: name } },
        );
        if (
            updateType.length === 0 ||
            updateType === undefined ||
            updateType === null ||
            updateType === ""
        ) {
            return res.status(200)
                .json([{ msg: "Type not found!!!", res: "error", }]);
        } else {
            const typeData = await type.findOne({ _id: typeId })
            return res.status(200)
                .json([{ msg: "Type updated successflly", data: typeData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { create, getAll, remove, update};