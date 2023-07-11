const { isEmpty } = require("lodash");
const banner = require("../models/banner");
const mongoose = require("mongoose");
const { uploadAttachment } = require("../utils");

//Create Banner
const createBanner = async (req, res) => {
 try {
    const { title } = req.body;
    if (isEmpty(title)) {
      return res.status(400).send({
        messge: "Mandatory fields missing while creating Banner",
        success: false,
      });
    }
    const file = req.file;
    let attachment = "";
    if (!isEmpty(file)) {
      attachment = await uploadAttachment(file);
    }
    const newBanner = await banner.create({
      bannerName: title,
      bannerImage: isEmpty(attachment) ? undefined : attachment,
    });
    return res.status(200).json({
      noticeBoard: newBanner,
      message: "Added New Banner Successfully",
      success: true,
    });
  } catch (err) {
    return res.status(400).json([{ msg: err.message, res: "error" }]);
  }
};

//Get All Banner
const getAllBanner = async (req, res) => {
  try {
    let allBanner = await banner.find();
    if (
      allBanner !== undefined &&
      allBanner.length !== 0 &&
      allBanner !== null
    ) {
      return res.status(200).send({
        allBanner,
        messge: "All Banner",
        success: true,
      });
    } else {
      return res.status(200).send({
        messge: "Banner does not exist",
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

// Delete Banner By Id
const deleteBannerById = async (req, res) => {
  try {
    const { id } = req.body;
    if (isEmpty(id)) {
      return res.status(400).send({
        messge: "Mandatory fields missing while deleting Banner",
        success: false,
      });
    }
    const bannerData = await banner.findByIdAndDelete(id);
    if (bannerData !== undefined && bannerData !== null) {
      return res.status(200).send({
        messge: "Banner deleted successfully",
        success: true,
      });
    } else {
      return res.status(200).send({
        messge: "Banner does not exist",
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

module.exports = { createBanner, getAllBanner, deleteBannerById };
