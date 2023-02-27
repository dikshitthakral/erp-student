const mongoose = require('mongoose');
const callLog = require('../../models/reception/callLog');

const save = async (req, res) => {
    try {  
        let response = await callLog.create(req.body);
        return res.status(200).json({
            callLog: response,
            message: "Added New callLog Successfully",
            success: true,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const update = async (req, res) => {
    try {
        const id = req.params['id'];
        let response = await callLog.findOneAndUpdate(
            { _id : mongoose.Types.ObjectId(id) },
            req.body
        );

        if (response) {
            return res.status(200).json({
                message: "Call Log updated Successfully",
                success: true,
            });
        }
        
        return res.status(404).json({ 
            msg: "Call Log not found!!!",
            res: "error" 
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const getAll = async (req, res) => {
    try {  
        let callLogs = await callLog.find();
        if (callLogs) {
           return res.status(200).send({
                callLogs,
                messge: "All Call Logs",
                success: true,
            });
        } 
          
        return res.status(200).send({
            messge: "Call Logs does not exist",
            success: false,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        let deleteCallLog = await callLog.deleteOne({ _id : mongoose.Types.ObjectId(id) });
        if (deleteCallLog["deletedCount"] === 1) {
            return res.status(200).json({
                id,
                message: "Call Log Deleted Successfully !!! ",
                success: true,
            });
        }

        return res.status(404).json({
            id,
            message: "Call Log Not found ",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = { save, update, getAll, remove };