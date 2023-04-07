const section = require('../models/section');
const mongoose = require('mongoose');
const { isEmpty, isNumber } = require('lodash');

const create = async (req, res) => {
    try {
        const { name, capacity } = req.body;
        if(isEmpty(name)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating section.",
                success: false,
            });
        }
        const newSection = await section.create({
            name,
            capacity: isNaN(capacity) ? undefined : Number(capacity)
        });
        return res.status(200).json({
            section: newSection,
            message: "Added New Section Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allSection = await section.find();
        if (
            allSection !== undefined &&
            allSection.length !== 0 &&
            allSection !== null
        ) {
          return res.status(200).send({
            sections: allSection,
            message: "All Sections",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Sections does not exist",
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
            message: "Section Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteSection = await section.deleteOne({ _id: id });
          if (
            deleteSection["deletedCount"] === 0 ||
            deleteSection === null ||
            deleteSection === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Section Not found ",
              success: true,
            });
          } else if (
            deleteSection["deletedCount"] === 1 &&
            deleteSection !== null &&
            deleteSection !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Section Deleted Successfully !!! ",
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
        const { sectionId, name, capacity } = req.body;
        if (isEmpty(sectionId)) {
            return res.status(400)
                .json([{ msg: "Section not found.", res: "error", }]);
        }
        const updateObject = {}
        updateObject["name"] = !isEmpty(name) ? name : undefined;
        updateObject["capacity"] = !isNaN(capacity) ? Number(capacity) : undefined;
        let updateSection = await section.findOneAndUpdate(
            { _id: sectionId },
            {
                $set: updateObject
            }
        );
        if (
            updateSection.length === 0 ||
            updateSection === undefined ||
            updateSection === null ||
            updateSection === ""
        ) {
            return res.status(200)
                .json([{ msg: "Section not found!!!", res: "error", }]);
        } else {
            const sectionData = await section.findOne({ _id: sectionId })
            return res.status(200)
                .json([{ msg: "Section updated successflly", data: sectionData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { create, getAll, remove, update};