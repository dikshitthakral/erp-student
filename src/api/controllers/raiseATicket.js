const raiseATicket = require('../models/raiseATicket');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');

const create = async (req, res) => {
    try {
        const { supportType, description, student,  sendTo  } = req.body;
        if(isEmpty(supportType) || isEmpty(description) || isEmpty(student) || isEmpty(sendTo)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while raising a ticket.",
                success: false,
            });
        }
        const newRaiseATicket = await raiseATicket.create({
            supportType,
            description,
            student,
            sendTo,
            status: 'PENDING'
        });
        return res.status(200).json({
            raiseATicket: newRaiseATicket,
            message: "Added new raiseATicket Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        let allRaiseATicket = await raiseATicket.find();
        if (
            allRaiseATicket !== undefined &&
            allRaiseATicket.length !== 0 &&
            allRaiseATicket !== null
        ) {
          return res.status(200).send({
            raiseATicket: allRaiseATicket,
            message: "All RaiseATicket",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "RaiseATicket does not exist",
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

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        if (!id) {
          return res.status(200).json({
            message: "raise a ticket Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteRaiseATicket = await raiseATicket.deleteOne({ _id: id });
          if (
            deleteRaiseATicket["deletedCount"] === 0 ||
            deleteRaiseATicket === null ||
            deleteRaiseATicket === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Raise A ticket Not found ",
              success: true,
            });
          } else if (
            deleteRaiseATicket["deletedCount"] === 1 &&
            deleteRaiseATicket !== null &&
            deleteRaiseATicket !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "Raise A ticket Deleted Successfully !!! ",
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

const updateStatus = async (req, res) => {
    try {
        const { raiseATicketId, status } = req.body;
        let updateTicket = await raiseATicket.findOneAndUpdate(
          { _id: raiseATicketId },
          { status: status.toUpperCase() }
        );
        if (
            updateTicket.length === 0 ||
            updateTicket === undefined ||
            updateTicket === null ||
            updateTicket === ""
        ) {
            return res.status(200)
                .json([{ msg: "Ticket not found!!!", res: "error", }]);
        } else {
            const studentData = await raiseATicket.findOne({ _id: raiseATicketId });
            return res.status(200)
                .json([{ msg: "Ticket Status updated successflly", data: studentData, res: "success" }]);
        }
    } catch(err) {
        return res.status(400).send({
            messge: "Somethig went wrong",
            success: false,
        });
    }
  }
module.exports = { create, getAll, remove, updateStatus };