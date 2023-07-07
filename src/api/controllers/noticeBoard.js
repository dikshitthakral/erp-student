const noticeBoard = require('../models/noticeBoard');
const mongoose = require('mongoose');
const { isEmpty } = require('lodash');
const { uploadAttachment } = require('../utils');

const create = async (req, res) => {
    try {
        const {type, name, description, noticeDate } = req.body;
        if(isEmpty(type),isEmpty(description) || isEmpty(noticeDate)) {
            return res.status(400).send({
                messge: "Mandatory fields missing while creating Notice Board.",
                success: false,
            });
        }
        const file = req.file;
        let attachment = '';
        if(!isEmpty(file)) {
            attachment = await uploadAttachment(file);
        }
        const newNoticeBoard = await noticeBoard.create({
            noticeBoardType: type,
            description,
            noticeDate,
            name: isEmpty(name) ? undefined : name,
            imageAttachment: isEmpty(attachment) ? undefined : attachment
        });
        return res.status(200).json({
            noticeBoard: newNoticeBoard,
            message: "Added New Notice Board Successfully",
            success: true,
        });
    }catch (err) {
        return res.status(400)
            .json([{ msg: err.message, res: "error" }]);
    }
}

const getAll = async (req, res) => {
    try {
        const { type } = req.params;
        let allNoticeBoard = await noticeBoard.find( { noticeBoardType: type });
        if (
            allNoticeBoard !== undefined &&
            allNoticeBoard.length !== 0 &&
            allNoticeBoard !== null
        ) {
          return res.status(200).send({
            noticeBoard: allNoticeBoard,
            messge: "All Notice Board",
            success: true,
          });
        } else {
          return res.status(200).send({
            messge: "Notice Board does not exist",
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
const getAllNoticeBoard = async (req, res) => {
  try {
      let allNoticeBoard = await noticeBoard.find();
      if (
          allNoticeBoard !== undefined &&
          allNoticeBoard.length !== 0 &&
          allNoticeBoard !== null
      ) {
        return res.status(200).send({
          noticeBoard: allNoticeBoard,
          messge: "All Notice Board",
          success: true,
        });
      } else {
        return res.status(200).send({
          messge: "Notice Board does not exist",
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
        const { id } = req.body;
        if (!id) {
          return res.status(200).json({
            message: "Notice Board Id not found",
            success: false,
          });
        } else if (id !== undefined && id !== null && id !== "") {
          const deleteNoticeBoard = await noticeBoard.deleteOne({ _id: id });
          if (
            deleteNoticeBoard["deletedCount"] === 0 ||
            deleteNoticeBoard === null ||
            deleteNoticeBoard === undefined
          ) {
            return res.status(404).json({
              id,
              message: "Notice Board Not found ",
              success: true,
            });
          } else if (
            deleteNoticeBoard["deletedCount"] === 1 &&
            deleteNoticeBoard !== null &&
            deleteNoticeBoard !== undefined
          ) {
            return res.status(200).json({
              id,
              message: "NoticeBoard Deleted Successfully !!! ",
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

module.exports = { create, getAll,getAllNoticeBoard, remove };
