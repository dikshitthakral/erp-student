const { advanceSalary } = require('../../models/humanResources/index');
const mongoose = require('mongoose');
const { isEmpty, sumBy } = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

const add = async (req, res) => {
    try {
        const { employee, deductMonth, amount, reason, status } = req.body;

        if(isEmpty(employee) || isNaN(amount) || isEmpty(deductMonth)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating AdvanceSalary Template",
                success: false,
            });
        }

        const advanceSalaryObj = {
            employee,
            deductMonth,
            amount : isNaN(amount) ? 0 : amount,
            reason: isEmpty(reason) ? undefined : reason,
            status: isEmpty(status) ? 'PENDING' : status.toUpperCase(),
        };

        const newAdvanceSalary = await advanceSalary.create(advanceSalaryObj);
        return res.status(200).json({
            advanceSalary: newAdvanceSalary,
            message: "Added New AdvanceSalary Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allAdvanceSalaries = await advanceSalary.find().populate('employee');
        if (
            allAdvanceSalaries !== undefined &&
            allAdvanceSalaries.length !== 0 &&
            allAdvanceSalaries !== null
        ) {
          return res.status(200).send({
            advanceSalaries: allAdvanceSalaries,
            messge: "All Advance Salaries",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Advance Salaries does not exist",
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
        let getAdvanceSalary = await advanceSalary.findOne({ _id: mongoose.Types.ObjectId(id)}).populate('employee');
        if (!isEmpty(getAdvanceSalary)) {
          return res.status(200).send({
            advanceSalary: getAdvanceSalary,
            messge: "Advance Salary By Id",
            success: true,
          });
        } else {
          return res.status(400).send({
            messge: "Advance Salary does not exist",
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
            message: "Advance Salary Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteAdvanceSalary = await advanceSalary.deleteOne({ _id: id });
          if (
            deleteAdvanceSalary["deletedCount"] === 0 ||
            deleteAdvanceSalary === null ||
            deleteAdvanceSalary === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Advance Salary Not found ",
              success: true,
            });
          } else if (
            deleteAdvanceSalary["deletedCount"] === 1 &&
            deleteAdvanceSalary !== null &&
            deleteAdvanceSalary !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Advance Salary Deleted Successfully !!! ",
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
        const { advanceSalaryId, employee, deductMonth, amount, reason, status, comment } = req.body;
        const updateObject = {}
        const advanceSalaryRecord = await advanceSalary.findOne({_id: mongoose.Types.ObjectId(advanceSalaryId)});
        updateObject["employee"] = !isEmpty(employee) ? employee : advanceSalaryRecord.employee;
        updateObject["deductMonth"] = !isEmpty(deductMonth) ? deductMonth : advanceSalaryRecord.deductMonth;
        updateObject["amount"] = !isNaN(amount) && amount > 0 ? amount: advanceSalaryRecord.amount;
        updateObject["reason"] = !isEmpty(reason) ? reason : advanceSalaryRecord.reason;
        updateObject["status"] = !isEmpty(status) ? status : advanceSalaryRecord.status;
        updateObject["comment"] = !isEmpty(comment) ? comment : advanceSalaryRecord.comment;

        let updateAdvanceSalary = await advanceSalary.findOneAndUpdate(
            { _id: advanceSalaryId },
            {
                $set: updateObject
            }
        );
        if (
            updateAdvanceSalary === undefined ||
            updateAdvanceSalary === null ||
            updateAdvanceSalary === ""
        ) {
            return res.status(200)
                .json([{ msg: "Advance Salary not found!!!", res: "error", }]);
        } else {
            const advanceSalaryData = await advanceSalary.findOne({ _id: advanceSalaryId })
            return res.status(200)
                .json([{ msg: "Advance Salary updated successflly", data: advanceSalaryData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
    }
}

module.exports = { add, getAll, getById, remove, update }