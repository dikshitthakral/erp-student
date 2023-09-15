const student = require('../models/students');
const raiseTicket = require('../models/raiseATicket');
const vehicle = require('../models/transport/vehicle');
const route = require('../models/transport/route');
const employee = require('../models/employee');
const classCount = require('../models/class');
const section = require('../models/section');
const studentAttandace = require('../models/studentAttendance');
const employeeAttandace = require('../models/employeeAttendance');
const visitorLog = require('../models/reception/visitoryLog');
const callLog = require('../models/reception/callLog');
const enquiry = require('../models/reception/enquiry');
const banner = require('../models/banner');
const noticeBoard = require('../models/noticeBoard');
const mongoose = require('mongoose');


const getAll = async (req, res) => {
    try {
        let students = await student.find();
        let employees = await employee.find();
        if (
            students !== undefined &&
            students.length !== 0 &&
            students !== null
        ) {
            const studentCount = students?.length;
            const employeeCount = employees?.length;

            const newEnrollStudentCount = students?.filter((student) => {
                const admissionDate = new Date(student?.admissionDate);
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate - admissionDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 90;
            })?.length;


            return res.status(200).send({
                studentCount: studentCount,
                employeeCount: employeeCount,
                newEnrollStudentCount: newEnrollStudentCount,
                message: `Total students: ${studentCount}, Total employees: ${employeeCount}`,
                success: true,
            });
        } else {
            return res.status(200).send({
                message: "No students or employees found",
                success: true,
            });
        }
    } catch (error) {
        return res.status(400).send({
            message: "Something went wrong",
            success: false,
        });
    }
}


const getTickets = async (req, res) => {
    try {
        let tickets = await raiseTicket.find();
        if (
            tickets !== undefined &&
            tickets.length !== 0 &&
            tickets !== null
        ) {
            const teacherTickets = tickets?.filter((ticket) => ticket?.raiseType === 'teacher');
            const studentTickets = tickets?.filter((ticket) => ticket?.raiseType === 'guardian');
            return res.status(200).send({
                teacherTickets: teacherTickets,
                studentTickets: studentTickets,
                teacherTicketCount: teacherTickets?.length,
                studentTicketCount: studentTickets?.length,
                message: `Total tickets: ${tickets?.length}`,
                success: true,
            });
        } else {
            return res.status(200).send({
                message: "No tickets found",
                success: true,
            });
        }
    } catch (error) {
        return res.status(400).send({
            message: "Something went wrong",
            success: false,
        });
    }
}

const getVehicleCount = async (req, res) => {
    try {
        const vehicles = await vehicle.find();
        const routes = await route.find();

        const vehicleCount = vehicles.length;
        const routeCount = routes.length;

        return res.status(200).send({
            vehicleCount,
            routeCount,
            message: vehicles.length > 0 ? 'All data' : 'No data found',
            success: true,
        });
    } catch (error) {
        return res.status(400).send({
            message: 'Something went wrong',
            success: false,
        });
    }
};

const getStudentEmpAttandance = async (req, res) => {
    try {
        const studentAtt = await studentAttandace.find();
        const employeeAtt = await employeeAttandace.find();

        const student = studentAtt.length ? studentAtt.length : 0;
        const employee = employeeAtt.length ? employeeAtt.length : 0;

        return res.status(200).send({
            student,
            employee,
            message: 'data found',
            success: true,
        });
    } catch (error) {
        return res.status(400).send({
            message: 'Something went wrong',
            success: false,
        });
    }
};

const allReceptionCount = async (req, res) => {
    try {
      const [
        visitorLogs,
        callLogs,
        enquirys,
        banners,
        noticeBoards,
      ] = await Promise.all([
        visitorLog.find(),
        callLog.find(),
        enquiry.find(),
        banner.find(),
        noticeBoard.find(),
      ]);
  
      const visitorCount = visitorLogs.length ? visitorLogs.length : 0;
      const callLogCount = callLogs.length ? callLogs.length : 0;
      const enquiryCount = enquirys.length ? enquirys.length : 0;
      const bannerCount = banners.length ? banners.length : 0;
      const noticeBoardCount = noticeBoards.length ? noticeBoards.length : 0;
  
      return res.status(200).send({
        visitorCount,
        callLogCount,
        enquiryCount,
        bannerCount,
        noticeBoardCount,
        message: 'data found',
        success: true,
      });
    } catch (error) {
      return res.status(400).send({
        message: 'Something went wrong',
        success: false,
      });
    }
  };
  


const getClassSectionCount = async (req, res) => {
    try {
        let classes = await classCount.find();
        let sections = await section.find();
        if (
            classes !== undefined &&
            classes.length !== 0 &&
            classes !== null
        ) {
            const classCount = classes?.length;
            const sectionCount = sections?.length;
            return res.status(200).send({
                classCount: classCount,
                sectionCount: sectionCount,
                message: `Total classes: ${classCount}, Total sections: ${sectionCount}`,
                success: true,
            });
        } else {
            return res.status(200).send({
                message: "No classes or sections found",
                success: true,
            });
        }
    } catch (error) {
        return res.status(400).send({
            message: "Something went wrong",
            success: false,
        });
    }
}
const totalVehicleAndROute = async (req, res) => {
    try {
        let classes = await classCount.find();
        let sections = await section.find();
        if (
            classes !== undefined &&
            classes.length !== 0 &&
            classes !== null
        ) {
            const classCount = classes?.length;
            const sectionCount = sections?.length;
            return res.status(200).send({
                classCount: classCount,
                sectionCount: sectionCount,
                message: `Total classes: ${classCount}, Total sections: ${sectionCount}`,
                success: true,
            });
        } else {
            return res.status(200).send({
                message: "No classes or sections found",
                success: true,
            });
        }
    } catch (error) {
        return res.status(400).send({
            message: "Something went wrong",
            success: false,
        });
    }
}

module.exports = { getAll, getTickets, getVehicleCount, getClassSectionCount,getStudentEmpAttandance,allReceptionCount };
