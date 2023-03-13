const { salaryReceipt } = require('../../models/humanResources/index');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const add = async (req, res) => {
    try {
        const { status, salaryPaidMonth, employee} = req.body;

        if(isEmpty(status) || isNaN(employee)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating Salary Receipt Template",
                success: false,
            });
        }

        const salaryReceiptObj = {
            status,
            salaryPaidMonth,
            employee
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

const getSalaryReceiptByMonth = async (req, res) => {
    try {
        const { salaryPaidMonth} = req.body;
        const salaryReceipts = await salaryReceipt.find({ salaryPaidMonth });
        if (isEmpty(salaryReceipts)) {
            return res.status(400)
                .json([{ msg: "salaryReceipts not found.", res: "error", }]);
        }
        return res.status(200).json({
            salary_receipts: salaryReceipts,
            message: "Fetched salary receipts by month",
            success: true,
        });
    } catch(err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}
module.exports = { add, getSalaryReceiptByMonth }