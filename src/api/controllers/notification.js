const { isEmpty } = require("lodash");
const Notification = require("../models/notification");
const mongoose = require("mongoose");

//Create Notification
const createNotification = async (req, res) => {
  try {
    const { type, title, description } = req.body;
    if ((isEmpty(type), isEmpty(title) || isEmpty(description))) {
      return res.status(400).send({
        messge: "Mandatory fields missing while creating Notification",
        success: false,
      });
    }
    const notification = await Notification.create({
      notiType: type,
      title: title,
      description: description,
    });
    return res.status(200).json({
      notification: notification,
      message: "Added New Notification Successfully",
      success: true,
    });
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

//Get All Notification
const getAllNotification = async (req, res) => {
  try {
    const { type } = req.params;
    let notification = await Notification.find({ notiType: type });
    if (
      notification !== undefined &&
      notification.length !== 0 &&
      notification !== null
    ) {
      return res.status(200).send({
        notification,
        messge: "All Notification",
        success: true,
      });
    } else {
      return res.status(200).send({
        messge: "Notification does not exist",
        success: false,
      });
    }
  } catch (error) {
    return res.status(400).send({
      messge: "Somethig went wrong",
      success: false,
    });
  }
};

// Delete Notification By Id
const deleteNotificationById = async (req, res) => {
  try {
    const { id } = req.body;
    if (isEmpty(id)) {
      return res.status(400).send({
        messge: "Mandatory fields missing while deleting notification",
        success: false,
      });
    }
    const notification = await Notification.findByIdAndDelete(id);
    if (notification !== undefined && notification !== null) {
      return res.status(200).send({
        messge: "Notification deleted successfully",
        success: true,
      });
    } else {
      return res.status(200).send({
        messge: "Notification does not exist",
        success: false,
      });
    }
  } catch (error) {
    return res.status(400).send({
      messge: "Somethig went wrong",
      success: false,
    });
  }
};

module.exports = {
  createNotification,
  getAllNotification,
  deleteNotificationById,
};
