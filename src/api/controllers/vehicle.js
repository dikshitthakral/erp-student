const vehicle = require('../models/vehicle');
const mongoose = require('mongoose');
const { v4 : uuidv4 } = require('uuid');

const save = async (req, res) => {
    try {    
        let payload = {
            ...req.body,
            vehicleId: uuidv4()
        }
        let response = await vehicle.create(payload);
        return res.status(200).json({
            vehicle: response,
            message: "Added New vehicle Successfully",
            success: true,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const getAll = async (req, res) => {
    try {
        let vehicles = await vehicle.find();
        if (vehicles) {
           return res.status(200).send({
            vehicles ,
                messge: "All Vehicles",
                success: true,
            });
        } 
          
        return res.status(200).send({
            messge: "Vehicle does not exist",
            success: false,
        });
    }   catch (error) {
        return res.status(400).json({ message: error.message, success: false });
    }
};

const update = async (req, res) => {
    try {
        const vehicleId = req.params['id'];
        const payload = req.body;
        const vehicleObj = await vehicle.findOne({ vehicleId });
        if(vehicleObj === null || vehicleObj === undefined || vehicleObj === '') {
            return res.status(400).json({
                message: "Vehicle not found in system",
                success: true,
            });
        }

        let response = await vehicle.findOneAndUpdate(
            { vehicleId },
            payload
        );

        if (response) {
            return res.status(200).json({
                message: "Vehicle updated Successfully",
                success: true,
            });
        }
        
        return res.status(200).json([{ 
            msg: "Vehicle not found!!!",
            res: "error" 
        }]);
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const remove = async (req, res) => {
    try {
        const vehicleId = req.params['id'];
        let deleteVehicle = await vehicle.deleteOne({ vehicleId });
        if (deleteVehicle["deletedCount"] === 1) {
            return res.status(200).json({
                vehicleId,
                message: "Vehicle Deleted Successfully !!! ",
                success: true,
            });
        }

        return res.status(404).json({
            vehicleId,
            message: "Vehicle Not found ",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}


module.exports = { save, getAll, update, remove };