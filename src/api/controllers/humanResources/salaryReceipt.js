const { salaryReceipt } = require('../../models/humanResources/index');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');
const Employee = require("../../models/employee");

const add = async (req, res) => {
    try {
        const { status, salaryPaidMonth, employee, totalAllowance, totalDeductions, overtimeHrs, overtimeAmount,
            netSalary, payVia, account} = req.body;

        if(isEmpty(status) || isEmpty(employee) || isEmpty(salaryPaidMonth)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating Salary Receipt Template",
                success: false,
            });
        }
        const salaryReceiptExists = await salaryReceipt.findOne({ salaryPaidMonth, employee });
        if(!isEmpty(salaryReceiptExists)) {
            return res.status(200).json({
                salaryReceipt: salaryReceiptExists,
                message: "Salary Receipt Already Exists",
                success: true,
            });
        }
        const salaryReceiptObj = {
            receiptNo: Math.floor(100000 + Math.random() * 900000),
            status,
            salaryPaidMonth,
            employee,
        };
        if(!isNaN(totalAllowance)) { salaryReceiptObj['totalAllowance'] = totalAllowance }
        if(!isNaN(totalDeductions)) { salaryReceiptObj['totalDeductions'] = totalDeductions }
        if(!isNaN(overtimeHrs)) { salaryReceiptObj['overtimeHrs'] = overtimeHrs }
        if(!isNaN(overtimeAmount)) { salaryReceiptObj['overtimeAmount'] = overtimeAmount }
        if(!isNaN(netSalary)) { salaryReceiptObj['netSalary'] = netSalary }
        if(!isEmpty(payVia)) { salaryReceiptObj['payVia'] = payVia  }
        if(!isEmpty(account)) { salaryReceiptObj['account'] = account  }
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
        const { salaryPaidMonth } = req.params;
        let allEmployees = await Employee.find().populate('designation').populate('department').
        populate({
          path: 'salaryGrade',
          populate: [{ path: 'allowances', model: 'Allowance'}, { path: 'deductions', model: 'Deduction'}]
        }).exec();
        let response = [];
        for(let employee of allEmployees) {
            let empoyeeResult = {
                ...employee._doc,
                designationName: employee.designation?.name || undefined,
                designationId: employee.designation?._id || undefined
            }
            const salaryReceiptDoc = await salaryReceipt.findOne({ salaryPaidMonth, employee: employee._id });
            if(isEmpty(salaryReceiptDoc)) {
                empoyeeResult['salaryStatus'] = 'NOT-PAID';
                empoyeeResult['totalAllowance'] = 0;
                empoyeeResult['totalDeductions'] = 0;
                empoyeeResult['overtimeHrs'] = 0;
                empoyeeResult['overtimeAmount'] = 0;
                empoyeeResult['netSalary'] = 0;
                empoyeeResult['payVia'] = '';
                empoyeeResult['account'] = '';
                empoyeeResult['receiptNo'] = ''
            } else {
                empoyeeResult['salaryStatus'] = salaryReceiptDoc.status;
                empoyeeResult['totalAllowance'] = salaryReceiptDoc.totalAllowance;
                empoyeeResult['totalDeductions'] = salaryReceiptDoc.totalDeductions;
                empoyeeResult['overtimeHrs'] = salaryReceiptDoc.overtimeHrs;
                empoyeeResult['overtimeAmount'] = salaryReceiptDoc.overtimeAmount;
                empoyeeResult['netSalary'] = salaryReceiptDoc.netSalary;
                empoyeeResult['payVia'] = salaryReceiptDoc.payVia;
                empoyeeResult['account'] = salaryReceiptDoc.account;
                empoyeeResult['receiptNo'] = salaryReceiptDoc.receiptNo ? salaryReceiptDoc.receiptNo : '';
                empoyeeResult['createdAt'] = salaryReceiptDoc.createdAt;
            }
            empoyeeResult['salaryMonth'] = salaryPaidMonth;
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

const getSalaryReceiptsByMonthAndEmployee = async (req, res) => {
    try {
        const { salaryPaidMonth, employee } = req.params;
        let employeeById = await Employee.findOne({ _id: employee }).populate('designation').populate('department').
            populate({
            path: 'salaryGrade',
            populate: [{ path: 'allowances', model: 'Allowance'}, { path: 'deductions', model: 'Deduction'}]
            }).exec();
        let empoyeeResult = {
            ...employeeById._doc,
            designationName: employeeById?.designation?.name,
            designationId: employeeById?.designation?._id
        }
        const salaryReceiptDoc = await salaryReceipt.findOne({ salaryPaidMonth, employee: employeeById._id });
        if(isEmpty(salaryReceiptDoc)) {
            empoyeeResult['salaryStatus'] = 'NOT-PAID';
            empoyeeResult['totalAllowance'] = 0;
            empoyeeResult['totalDeductions'] = 0;
            empoyeeResult['overtimeHrs'] = 0;
            empoyeeResult['overtimeAmount'] = 0;
            empoyeeResult['netSalary'] = 0;
            empoyeeResult['payVia'] = '';
            empoyeeResult['account'] = '';
            empoyeeResult['receiptNo'] = '';
            empoyeeResult['createdAt'] = new Date();
        } else {
            empoyeeResult['salaryStatus'] = salaryReceiptDoc.status;
            empoyeeResult['totalAllowance'] = salaryReceiptDoc.totalAllowance;
            empoyeeResult['totalDeductions'] = salaryReceiptDoc.totalDeductions;
            empoyeeResult['overtimeHrs'] = salaryReceiptDoc.overtimeHrs;
            empoyeeResult['overtimeAmount'] = salaryReceiptDoc.overtimeAmount;
            empoyeeResult['netSalary'] = salaryReceiptDoc.netSalary;
            empoyeeResult['payVia'] = salaryReceiptDoc.payVia;
            empoyeeResult['account'] = salaryReceiptDoc.account;
            empoyeeResult['receiptNo'] = salaryReceiptDoc.receiptNo;
            empoyeeResult['createdAt'] = salaryReceiptDoc.createdAt;
        }
        empoyeeResult['salaryMonth'] = salaryPaidMonth;
        if (isEmpty(empoyeeResult)) {
            return res.status(400)
                .json([{ msg: "salaryReceipts not found for employee", res: "error", }]);
        }
        return res.status(200).json({
            salary_receipts: empoyeeResult,
            message: "Fetched salary receipt by month and Year for employee",
            success: true,
        });
    } catch(err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getSalaryReceiptsOfEmployee = async (req, res) => {
    try {
        const { employee } = req.params;
        let year =  new Date().getFullYear();
        const salaryReceipts = await salaryReceipt.find({ salaryPaidMonth: { $regex: '.*' + year + '.*' }, employee: employee });
        
        if (isEmpty(salaryReceipts)) {
            return res.status(400)
                .json([{ msg: "salaryReceipts not found for employee", res: "error", }]);
        }
        return res.status(200).json({
            salary_receipts: salaryReceipts,
            message: "Fetched salary receipt by month and Year for employee",
            success: true,
        });
    } catch(err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

module.exports = { add, getSalaryReceiptsByMonthAndYear, getSalaryReceiptsByMonthAndEmployee, getSalaryReceiptsOfEmployee }
