const department = require('../models/department');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
          return res.status(200).json({
            message: "Department Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteDepartment = await department.deleteOne({ _id: id });
          if (
            deleteDepartment["deletedCount"] === 0 ||
            deleteDepartment === null ||
            deleteDepartment === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Department Not found ",
              success: true,
            });
          } else if (
            deleteDepartment["deletedCount"] === 1 &&
            deleteDepartment !== null &&
            deleteDepartment !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Department Deleted Successfully !!! ",
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
          const newDepartment = await department.create({
            name,
            description:  isEmpty(description) ? undefined : description
          });
          return res.status(200).json({
            department: newDepartment,
            message: "Added New Department Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allDepartments = await department.find();
        if (
            allDepartments !== undefined &&
            allDepartments.length !== 0 &&
            allDepartments !== null
        ) {
          return res.status(200).send({
            departments: allDepartments,
            messge: "All Departments",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Departments does not exist",
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
        let updateDepartment = await department.findOneAndUpdate(
            { _id: id },
            {
                $set: updateObj
            }
        );
        if (
            updateDepartment.length === 0 ||
            updateDepartment === undefined ||
            updateDepartment === null ||
            updateDepartment === ""
        ) {
            return res.status(200)
                .json([{ msg: "Department not found!!!", res: "error", }]);
        } else {
            const departmentData = await department.findOne({ _id: id })
            return res.status(200)
                .json([{ msg: "Department updated successflly", data: departmentData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
      }
}

module.exports = { remove, create, getAll, update }