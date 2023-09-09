const query = require('../models/query');
const { isEmpty } = require('lodash');
const { uploadAttachment } = require('../utils');

const createQuery = async (req, res) => {
  try {
    const { question, student, employee } = req.body;
    if (isEmpty(question) || isEmpty(student) || isEmpty(employee)) {
      return res.status(200).send({
        messge: "All field are required",
        success: false,
      });
    }
    const file = req.file;
    let attachment = '';
    if (!isEmpty(file)) {
      attachment = await uploadAttachment(file);
    }
    let data = {
      type: 'student',
      question,
      student,
      employee,
      questionAttachment: attachment
    }
    const result = await query.create(data);
    return res.status(200).json({
      query: result,
      message: "chat created",
      success: true,
    });
  } catch (err) {
    return res.status(400)
      .json([{ msg: err.message, res: "error" }]);
  }
}
const replyQuery = async (req, res) => {
  try {
    const { answer, student, employee } = req.body;
    if (isEmpty(student) || isEmpty(employee)) {
      return res.status(200).send({
        messge: "All filed are required",
        success: false,
      });
    }
    const file = req.file;
    let attachment = '';
    if (!isEmpty(file)) {
      attachment = await uploadAttachment(file);
    }
    let data = {
      type: 'teacher',
      answer,
      student,
      employee,
      answerAttachment: attachment
    }
    const result = await query.create(data);
    return res.status(200).json({
      query: result,
      message: "Query send successfully",
      success: true,
    });
  } catch (err) {
    return res.status(400)
      .json([{ msg: err.message, res: "error" }]);
  }
}


const getTeacherHistory = async (req, res) => {
  try {
    const teacherId = req.params['teacherId'];
    if (isEmpty(teacherId)) {
      return res.status(200).send({
        messge: "teacher id is required",
        success: false,
      });
    }
    let history = await query.find({ employee: teacherId }).populate('employee').populate('student')
      .sort({
        createdAt: 'asc'
      });
    if (history?.length >= 1) {
      let queryLoop = new Map();
      for (let query of history) {
        if (!queryLoop.has(query?.student?._id)) {
          queryLoop.set(query?.student?._id, {
            studentId: query?.student?._id,
            studentName: query?.student?.firstName + ' ' + query?.student?.lastName,
            studentEmail: query?.student?.email
          })
        }
      }
      return res.status(200).send({
        queries: [...queryLoop.values()],
        messge: "All data",
        success: true,
      });
    } else {
      return res.status(200).send({
        messge: "data not found",
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

const getStudentHistory = async (req, res) => {
  try {
    const studentId = req.params['studentId'];
    if (isEmpty(studentId)) {
      return res.status(200).send({
        messge: "student id is required",
        success: false,
      });
    }
    let history = await query.find({ student: studentId }).populate('employee').populate('student')
      .sort({
        createdAt: 'asc'
      });
    if (
      history !== undefined &&
      history.length !== 0 &&
      history !== null
    ) {
      let queryLoop = new Map();
      for (let query of history) {
        if (!queryLoop.has(query?.employee?._id)) {
          queryLoop.set(query?.employee?._id, {
            employeeId: query?.employee?._id,
            employeeName: query?.employee?.name,
            employeeEmail: query?.employee?.email
          })
        }
      }
      return res.status(200).send({
        queries: [...queryLoop.values()],
        messge: "All History",
        success: true,
      });
    } else {
      return res.status(200).send({
        messge: "History not found",
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

const getAllQueryStudentAndTeacher = async (req, res) => {
  try {
    const teacherId = req.params['teacherId'];
    const studentId = req.params['studentId'];
    let data = await query.find({ employee: teacherId, student: studentId }).populate('employee').populate('student')
      .sort({
        createdAt: 'asc'
      });
    if (
      data !== undefined &&
      data.length !== 0 &&
      data !== null
    ) {
      const result = data.map(item => ({
        type:item?.type,
        senderId: item?.employee?._id,
        receiverId: item?.student?._id,
        answer: item?.answer ? item?.answer : "",
        question: item?.question ? item?.question : "",
        questionAttachment: item?.questionAttachment ? item?.questionAttachment : "",
        answerAttachment: item?.answerAttachment ? item?.answerAttachment : "",
      }));
      return res.status(200).send({
        queries: result,
        messge: "All data",
        success: true,
      });
    } else {
      return res.status(200).send({
        messge: "data not found",
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

module.exports = { createQuery, replyQuery, getTeacherHistory, getStudentHistory, getAllQueryStudentAndTeacher };
