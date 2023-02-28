const mongoose = require('mongoose');
const stoppage = require('../../models/transport/stoppage');

const save = async (req, res) => {
    try {
        let response = await stoppage.create(req.body);
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
        const id = req.params['id'];
        const payload = req.body;
        const stoppageObj = await stoppage.findOne({ _id : mongoose.Types.ObjectId(id) });
        if(stoppageObj === null || stoppageObj === undefined || stoppageObj === '') {
            return res.status(400).json({
                message: "Stoppage not found in system",
                success: true,
            });
        }
        
        let response = await stoppage.findOneAndUpdate(
            { _id : mongoose.Types.ObjectId(id) },
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
        const id = req.params['id'];
        let deleteStoppage = await stoppage.deleteOne({ _id : mongoose.Types.ObjectId(id) });
        if (deleteStoppage["deletedCount"] === 1) {
            return res.status(200).json({
                id,
                message: "Stoppage Deleted Successfully !!! ",
                success: true,
            });
        }

        return res.status(404).json({
            id,
            message: "Stoppage Not found ",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}


module.exports = { save, getAll, update, remove };