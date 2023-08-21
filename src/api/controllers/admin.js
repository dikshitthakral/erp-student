const student = require('../models/students');
const raiseTicket = require('../models/raiseATicket');
const vehicle = require('../models/transport/vehicle');
const employee = require('../models/employee');
const classCount = require('../models/class');
const section = require('../models/section');
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
        let vehicles = await vehicle.find();
        if (
            vehicles !== undefined &&
            vehicles.length !== 0 &&
            vehicles !== null
        ) {
            const vehicleCount = vehicles?.length;
            return res.status(200).send({
                vehicleCount: vehicleCount,
                message: `Total vehicles: ${vehicleCount}`,
                success: true,
            });
        } else {
            return res.status(200).send({
                vehicleCount: 0,
                message: "No vehicles found",
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

module.exports = { getAll,getTickets,getVehicleCount,getClassSectionCount };
