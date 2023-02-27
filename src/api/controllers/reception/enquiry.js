const mongoose = require('mongoose');
const enquiry = require('../../models/reception/enquiry');

const save = async (req, res) => {
    try {  
        let response = await enquiry.create(req.body);
        return res.status(200).json({
            enquiry: response,
            message: "Added New enquiry Successfully",
            success: true,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const update = async (req, res) => {
    try {
        const id = req.params['id'];
        let response = await enquiry.findOneAndUpdate(
            { _id : mongoose.Types.ObjectId(id) },
            req.body
        );

        if (response) {
            return res.status(200).json({
                message: "Enquiry updated Successfully",
                success: true,
            });
        }
        
        return res.status(404).json({ 
            msg: "Enquiry not found!!!",
            res: "error" 
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const getAll = async (req, res) => {
    try {  
        let enquiries = await enquiry.find();
        if (enquiries) {
           return res.status(200).send({
                enquiries,
                messge: "All Enquiries",
                success: true,
            });
        } 
          
        return res.status(200).send({
            messge: "Enquiries does not exist",
            success: false,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        let deleteEnquiry = await enquiry.deleteOne({ _id : mongoose.Types.ObjectId(id) });
        if (deleteEnquiry["deletedCount"] === 1) {
            return res.status(200).json({
                id,
                message: "Enquiry Deleted Successfully !!! ",
                success: true,
            });
        }

        return res.status(404).json({
            id,
            message: "Enquiry Not found ",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = { save, update, getAll, remove };