const { salary } = require('../../models/humanResources/index');
const mongoose = require('mongoose');
const { isEmpty, sumBy } = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

const validateAllowanceAndDeductionsModel = (model) => {
    let validatedModel = [];
    for(let value of model) {
        if(!isEmpty(value.name) && !isNaN(value.amount)) {
            validatedModel.push(value);
        }
    }
    return validatedModel
}
const add = async (req, res) => {
    try {
        const { salaryGrade, basicSalary, overTimeRatePerHr, allowances, deductions} = req.body;

        if(isEmpty(salaryGrade) || isNaN(basicSalary)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating Salary Template",
                success: false,
            });
        }

        const salaryObj = {
            salaryGrade,
            basicSalary,
            overTimeRatePerHr : isNaN(overTimeRatePerHr) ? 0 : overTimeRatePerHr,
            allowances: validateAllowanceAndDeductionsModel(allowances || []),
            deductions: validateAllowanceAndDeductionsModel(deductions || []),
        };
        salaryObj.allowances.length > 0 ? salaryObj['totalAllowance'] = sumBy(salaryObj.allowances, 'amount') : 0;
        salaryObj.deductions.length > 0 ? salaryObj['totalDeductions'] = sumBy(salaryObj.deductions, 'amount') : 0;
        salaryObj['netSalary'] = salaryObj['basicSalary'] + salaryObj['totalAllowance'] - salaryObj['totalDeductions'];

        const newSalary = await salary.create(salaryObj);
        return res.status(200).json({
            schedule: newSalary,
            message: "Added New Salary Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allSalaries = await salary.find().populate([{
            path: 'allowances', model: 'Allowance'}, { path: 'deductions', model: 'Deduction'}
        ]);
        if (
            allSalaries !== undefined &&
            allSalaries.length !== 0 &&
            allSalaries !== null
        ) {
          return res.status(200).send({
            feeGroups: allSalaries,
            messge: "All Salaries",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Salaries does not exist",
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
        let getSalary = await salary.findOne({ _id: mongoose.Types.ObjectId(id)}).populate([{
            path: 'allowances', model: 'Allowance'}, { path: 'deductions', model: 'Deduction'}
        ]);
        if (!isEmpty(getSalary)) {
          return res.status(200).send({
            salary: getSalary,
            messge: "Salary ById",
            success: true,
          });
        } else {
          return res.status(400).send({
            messge: "Salary does not exist",
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
            message: "Salary Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteSalary = await salary.deleteOne({ _id: id });
          if (
            deleteSalary["deletedCount"] === 0 ||
            deleteSalary === null ||
            deleteSalary === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Salary Not found ",
              success: true,
            });
          } else if (
            deleteSalary["deletedCount"] === 1 &&
            deleteSalary !== null &&
            deleteSalary !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Salary Deleted Successfully !!! ",
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
        const { salaryId, salaryGrade, basicSalary, overTimeRatePerHr, allowances, deductions} = req.body;
        const updateObject = {}
        const salaryRecord = await salary.findOne({_id: mongoose.Types.ObjectId(salaryId)});
        updateObject["salaryGrade"] = !isEmpty(salaryGrade) ? salaryGrade : salaryRecord.salaryGrade;
        updateObject["basicSalary"] = !isNaN(basicSalary) && basicSalary > 0 ? basicSalary : salaryRecord.basicSalary;
        updateObject["overTimeRatePerHr"] = !isNaN(basicSalary) && basicSalary > 0 ? overTimeRatePerHr: salaryRecord.overTimeRatePerHr;
        updateObject["allowances"] = !isEmpty(allowances) ? validateAllowanceAndDeductionsModel(allowances || []) : salaryRecord.allowances;
        updateObject["deductions"] = !isEmpty(deductions) ? validateAllowanceAndDeductionsModel(deductions || []) : salaryRecord.deductions;
        
        updateObject.allowances.length > 0 ? updateObject['totalAllowance'] = sumBy(updateObject.allowances, 'amount') : 0;
        updateObject.deductions.length > 0 ? updateObject['totalDeductions'] = sumBy(updateObject.deductions, 'amount') : 0;
        updateObject['netSalary'] = updateObject['basicSalary'] + updateObject['totalAllowance'] - updateObject['totalDeductions'];

        let updateSalary = await salary.findOneAndUpdate(
            { _id: salaryId },
            {
                $set: updateObject
            }
        );
        if (
            updateSalary.length === 0 ||
            updateSalary === undefined ||
            updateSalary === null ||
            updateSalary === ""
        ) {
            return res.status(200)
                .json([{ msg: "Salary not found!!!", res: "error", }]);
        } else {
            const salaryData = await salary.findOne({ _id: salaryId })
            return res.status(200)
                .json([{ msg: "Salary updated successflly", data: salaryData, res: "success" }]);
        }
    } catch (error) {
        return res.status(400).send({
          messge: "Somethig went wrong",
          success: false,
        });
    }
}

module.exports = { add, getAll, getById, remove, update }