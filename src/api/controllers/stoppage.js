const mongoose = require('mongoose');
const { v4 : uuidv4 } = require('uuid');
const stoppage = require('../models/stoppage');

const save = async (req, res) => {
    try {
        let payload = {
            ...req.body,
            stoppageId: uuidv4()
        }
        let response = await stoppage.create(payload);
        return res.status(200).json({
            stoppage: response,
            message: "Added new Stoppage Successfully",
            success: true,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const getAll = async (req, res) => {
    try {
        let stoppages = await stoppage.find();
        if (stoppages) {
           return res.status(200).send({
                stoppages ,
                messge: "All Stoppages",
                success: true,
            });
        } 
          
        return res.status(200).send({
            messge: "Stoppages does not exist",
            success: false,
        });
    }   catch (error) {
        return res.status(400).json({ message: error.message, success: false });
    }
};

const update = async (req, res) => {
    try {
        const stoppageId = req.params['id'];
        const payload = req.body;
        const stoppageObj = await stoppage.findOne({ stoppageId });
        if(stoppageObj === null || stoppageObj === undefined || stoppageObj === '') {
            return res.status(400).json({
                message: "Stoppage not found in system",
                success: true,
            });
        }
        
        let response = await stoppage.findOneAndUpdate(
            { stoppageId },
            payload
        );
        if (response) {
            return res.status(200).json({
                message: "Stoppage updated successfully",
                success: true,
            });
        }
        
        return res.status(200).json([{ 
            msg: "Stoppage not found!!!",
            res: "error" 
        }]);
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const remove = async (req, res) => {
    try {
        const stoppageId = req.params['id'];
        let deleteStoppage = await stoppage.deleteOne({ stoppageId });
        if (deleteStoppage["deletedCount"] === 1) {
            return res.status(200).json({
                stoppageId,
                message: "Stoppage Deleted Successfully !!! ",
                success: true,
            });
        }

        return res.status(404).json({
            stoppageId,
            message: "Stoppage Not found ",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}


module.exports = { save, getAll, update, remove };