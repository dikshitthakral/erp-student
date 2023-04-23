const { salaryReceipt } = require('../../models/humanResources/index');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');
const Employee = require("../../models/employee");

const add = async (req, res) => {
    try {
        const { status, salaryPaidMonth, employee, year} = req.body;

        if(isEmpty(status) || isEmpty(employee)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating Salary Receipt Template",
                success: false,
            });
        }

        const salaryReceiptObj = {
            status,
            salaryPaidMonth,
            employee,
            year
        };

        const newSalaryReceipt = await salaryReceipt.create(salaryReceiptObj);
        return res.status(200).json({
            salaryReceipt: newSalaryReceipt,
            message: "Added New Salary Receipt Successfully",
            success: true,
        });
    } catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getSalaryReceiptsByMonthAndYear = async (req, res) => {
    try {
        const { salaryPaidMonth, year} = req.params;
        let allEmployees = await Employee.find().populate('designation').exec();
        let response = [];
        for(let employee of allEmployees) {
            let empoyeeResult = {
                ...employee._doc,
                designationName: employee.designation.name,
                designationId: employee.designation._id
            }
            const salaryReceiptDoc = await salaryReceipt.findOne({ salaryPaidMonth, year, employee: employee._id });
            if(isEmpty(salaryReceiptDoc)) {
                empoyeeResult['salaryStatus'] = 'NOT-PAID';
            } else {
                empoyeeResult['salaryStatus'] = salaryReceiptDoc.status;
            }
            empoyeeResult['salaryMonth'] = salaryPaidMonth;
            empoyeeResult['salaryYear'] = year;
            response.push(empoyeeResult);
        }
        if (isEmpty(response)) {
            return res.status(400)
                .json([{ msg: "salaryReceipts not found for employees", res: "error", }]);
        }
        return res.status(200).json({
            salary_receipts: response,
            message: "Fetched salary receipts by month and Year for employees",
            success: true,
        });
    } catch(err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}
module.exports = { add, getSalaryReceiptsByMonthAndYear }