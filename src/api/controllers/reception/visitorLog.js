const mongoose = require('mongoose');
const visitoryLog = require('../../models/reception/visitoryLog');

const save = async (req, res) => {
    try {  
        let response = await visitoryLog.create(req.body);
        return res.status(200).json({
            visitoryLog: response,
            message: "Added New Visitory Log Successfully",
            success: true,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const update = async (req, res) => {
    try {
        const id = req.params['id'];
        let response = await visitoryLog.findOneAndUpdate(
            { _id : mongoose.Types.ObjectId(id) },
            req.body
        );

        if (response) {
            return res.status(200).json({
                message: "Visitor Log updated Successfully",
                success: true,
            });
        }
        
        return res.status(404).json({ 
            msg: "Visitor Log not found!!!",
            res: "error" 
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const getAll = async (req, res) => {
    try {  
        let callLogs = await visitoryLog.find();
        if (callLogs) {
           return res.status(200).send({
                callLogs,
                messge: "All Visitor Logs",
                success: true,
            });
        } 
          
        return res.status(200).send({
            messge: "Visitor Logs does not exist",
            success: false,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        let deleteVisitorLog = await visitoryLog.deleteOne({ _id : mongoose.Types.ObjectId(id) });
        if (deleteVisitorLog["deletedCount"] === 1) {
            return res.status(200).json({
                id,
                message: "Visitor Log Deleted Successfully !!! ",
                success: true,
            });
        }

        return res.status(404).json({
            id,
            message: "Visitor Log Not found ",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = { save, update, getAll, remove };