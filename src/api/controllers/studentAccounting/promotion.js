const feeGroup = require("../../models/studentAccounting/feeGroup");
const mongoose = require("mongoose");
const academicsService = require("../../services/academic");
const { isEmpty, find } = require("lodash");
const academics = require("../../models/academic");
const students = require("../../models/students");
const feeConcession = require("../../models/studentAccounting/feeConcession");
const academicFeeType = require("../../models/studentAccounting/academicFeeType");
const trackConcession = require("../../models/studentAccounting/trackConcession");

const promoteAll = async (req, res) => {
  try {
    const {
      academicYear,
      studentClass,
      section,
      promoteacademicYear,
      promotestudentClass,
      promoteSection,
    } = req.body;
    if (
      isEmpty(academicYear) ||
      isEmpty(
        studentClass ||
        isEmpty(section) ||
        isEmpty(promoteacademicYear) ||
        isEmpty(promotestudentClass) ||
        isEmpty(promoteSection)
      )
    ) {
      return res.status(400).send({
        messge: "Mandatory fields missing while promoting all students.",
        success: false,
      });
    }
    const findAcademic = await academicsService.getIdIfAcademicExists({
      academicYear,
      studentClass,
      section,
    });
    if (findAcademic === null) {
      return res.status(400).send({
        messge: "Academic not found.",
        success: false,
      });
    }
    const updateAcademic = await academicsService.getIdIfAcademicExists({
      academicYear: promoteacademicYear,
      studentClass: promotestudentClass,
      section: promoteSection,
    });
    if (updateAcademic === null) {
      return res.status(400).send({
        messge: "Update Academic not found.",
        success: false,
      });
    }
    const findStudent = await students.find({ academic: findAcademic._id });
    const academicFee = await academicFeeType.find({
      class: studentClass,
      year: academicYear,
    });
    findStudent.map(async (student) => {
      const findFeeConcession = await feeConcession.find({
        studentId: student._id,
        academicYear: academicYear,
      });
      const fConcession = await trackConcession.find({
        studentId: student._id
      });
      const totalAmount = findFeeConcession[0]?.allFee[0]?.totalAmount;
      const totalFinalAmount = totalAmount + (totalAmount * 10) / 100;
      let promotionAmount = '0';
      if (fConcession) {
        const value = fConcession[0];
        const finalConcession = value.amount + (value.amount * 10) / 100;
        promotionAmount = finalConcession;
        await trackConcession.updateOne(
          { _id: value._id },
          { $set: { amount: promotionAmount } }
        );
      }
      const invoice = Math.floor(100000 + Math.random() * 900000);
      const newFeeConcession = new feeConcession({
        invoiceNo: invoice,
        studentId: student._id,
        feemode: null,
        academicYear: promoteacademicYear,
        studentClass: promotestudentClass,
        totalFinalAmount: promotionAmount,
        isEditableCategory: true,
        // allFee: academicFee[0]?.feeCategory.map((fee) => {
        //   return {
        //     id: fee._id,
        //     categoryName: fee.categoryName,
        //     code: fee.code,
        //     // amount:fee.concession === "" ? totalAmount : totalFinalAmount,
        //     amount: promotionAmount,
        //     concession: fee.concession ? fee.concession : "",
        //     // totalAmount: fee.concession === "" ? totalAmount : totalFinalAmount,
        //     totalAmount: promotionAmount,
        //     isChecked: fee.isChecked ? fee.isChecked : true,
        //   };
        // }),
        allFee: academicFee[0].feeCategory.map((fee, index) => {
          if (index === 0) {
            return {
              ...fee,
              amount: fee?.concession === "" ? fee?.amount : totalFinalAmount,
              concession: "0",
              hike: "10",
              totalAmount: fee?.concession === "" ? fee?.totalAmount : totalFinalAmount,
              isChecked: fee?.isChecked ? fee?.isChecked : true,
            };
          } else {
            return {
              ...fee,
              concession: "0",
              hike: "",
              totalAmount: fee?.amount,
              isChecked: false,
            };
          }
        }),
        allMode: [],
      });
      if (
        findFeeConcession[0]?.studentId.toString() === student._id.toString()
      ) {
        await newFeeConcession.save();
      }
    });
    const updateStudent = await students.updateMany(
      { academic: findAcademic._id },
      {
        $set: {
          academic: updateAcademic._id,
          studentClass: promotestudentClass,
          section: promoteSection,
        },
      }
    );
    return res.status(200).json({
      updateStudent,
      message: "Students promoted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const notPromoteAll = async (req, res) => {
  try {
    const {
      academicYear,
      studentClass,
      section,
      promoteacademicYear,
      promotestudentClass,
      promoteSection,
      studentId,
    } = req.body;
    if (
      isEmpty(academicYear) ||
      isEmpty(
        studentClass ||
        isEmpty(section) ||
        isEmpty(promoteacademicYear) ||
        isEmpty(promotestudentClass) ||
        isEmpty(promoteSection) ||
        isEmpty(studentId)
      )
    ) {
      return res.status(400).send({
        messge: "Mandatory fields missing while not promoting all students.",
        success: false,
      });
    }
    const findAcademic = await academicsService.getIdIfAcademicExists({
      academicYear,
      studentClass,
      section,
    });
    if (findAcademic === null) {
      return res.status(400).send({
        messge: "Academic not found.",
        success: false,
      });
    }
    const updateAcademic = await academicsService.getIdIfAcademicExists({
      academicYear: promoteacademicYear,
      studentClass: promotestudentClass,
      section: promoteSection,
    });
    if (updateAcademic === null) {
      return res.status(400).send({
        messge: "Update Academic not found.",
        success: false,
      });
    }
    const findStudent = await students.find({ academic: findAcademic._id });
    const academicFee = await academicFeeType.find({
      class: studentClass,
      year: academicYear,
    });
    findStudent.map(async (student) => {
      const findFeeConcession = await feeConcession.find({
        studentId: student._id,
        academicYear: academicYear,
      });
      const fConcession = await trackConcession.find({
        studentId: student._id
      });
      const totalAmount = findFeeConcession[0]?.allFee[0]?.totalAmount;
      const totalFinalAmount = totalAmount + (totalAmount * 10) / 100;
      if (fConcession) {
        const value = fConcession[0];
        const finalConcession = value.amount + (value.amount * 10) / 100;
        promotionAmount = finalConcession;
        await trackConcession.updateOne(
          { _id: value._id },
          { $set: { amount: promotionAmount } }
        );
      }
      const invoice = Math.floor(100000 + Math.random() * 900000);
      const newFeeConcession = new feeConcession({
        invoiceNo: invoice,
        studentId: student._id,
        feemode: null,
        academicYear: promoteacademicYear,
        studentClass: promotestudentClass,
        totalFinalAmount: promotionAmount,
        isEditableCategory: true,
        allFee: academicFee[0].feeCategory.map((fee, index) => {
          if (index === 0) {
            return {
              ...fee,
              amount: fee?.concession === "" ? fee?.amount : totalFinalAmount,
              concession: "0",
              hike: "10",
              totalAmount: fee?.concession === "" ? fee?.totalAmount : totalFinalAmount,
              isChecked: fee?.isChecked ? fee?.isChecked : true,
            };
          } else {
            return {
              ...fee,
              concession: "0",
              hike: "",
              totalAmount: fee?.amount,
              isChecked: false,
            };
          }
        }),
        allMode: [],
      });
      if (
        findFeeConcession[0]?.studentId.toString() === student._id.toString()
      ) {
        await newFeeConcession.save();
      }
    });
    const student = await students.find({
      academic: findAcademic._id,
      _id: { $nin: studentId },
    });
    const updateStudent = await students.updateMany(
      { academic: findAcademic._id, _id: { $nin: studentId } },
      {
        $set: {
          academic: updateAcademic._id,
          studentClass: promotestudentClass,
          section: promoteSection,
        },
      }
    );
    return res.status(200).json({
      updateStudent,
      message: "Students promoted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

module.exports = { promoteAll, notPromoteAll };
