const vehicle = require('../../models/transport/vehicle');
const mongoose = require('mongoose');
const vehicleService = require('../../services/vehicle');
const { isEmpty } = require('lodash');

const save = async (req, res) => {
    try {
        let response = await vehicle.create(req.body);
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
        let vehicles = await vehicle.find().populate('expenses');
        if (vehicles) {
           return res.status(200).send({
                vehicles,
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
        const id = req.params['id'];
        const payload = req.body;
        const vehicleObj = await vehicle.findOne({ _id : mongoose.Types.ObjectId(id) });
        if(vehicleObj === null || vehicleObj === undefined || vehicleObj === '') {
            return res.status(400).json({
                message: "Vehicle not found in system",
                success: true,
            });
        }

        let response = await vehicle.findOneAndUpdate(
            { _id : mongoose.Types.ObjectId(id) },
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
        let deleteVehicle = await vehicle.deleteOne({ _id : mongoose.Types.ObjectId(vehicleId) });
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
};

const addExpenseReport = async (req, res) => {
    try {
        const { vehicleId, expenseName, expenseValue, expenseTime, description } = req.body;
        const existingVehicle = await vehicle.findOne({ _id: vehicleId });
        if(isEmpty(existingVehicle)) {
            return res.status(400).json({ message: 'Vehichle not found', success: false });
        }
        if(isEmpty(expenseName) || isNaN(expenseValue)) {
            return res.status(400).json({ message: 'Mandatory fields missing.', success: false });
        }
        const expenseObject = {
            name: expenseName,
            amount: isNaN(expenseValue) ? 0 : Number(expenseValue),
            time: expenseTime,
            description: isEmpty(description) ? undefined : description
        }
        const files = req?.files;
        let uploadedLocations = [];
        if(!isEmpty(files)) {
            uploadedLocations = await vehicleService.uploadDocuments(files);
        }
        expenseObject['attachement1'] = uploadedLocations.length > 0 ? uploadedLocations[0] : undefined;
        expenseObject['attachement2'] = uploadedLocations.length > 1 ? uploadedLocations[1] : undefined;
        expenseObject['attachement3'] = uploadedLocations.length > 2 ? uploadedLocations[2] : undefined;
        const expenseArray = isEmpty(existingVehicle.expenses) ? 
        [expenseObject] : [...existingVehicle.expenses, expenseObject];
        let response = await vehicle.findOneAndUpdate(
            { _id : mongoose.Types.ObjectId(vehicleId) },
            { $set: { expenses : expenseArray }}
        );
        if (
            response.length === 0 ||
            response === undefined ||
            response === null ||
            response === ""
          ) {
              return res.status(200)
                  .json([{ msg: "Update expense of vehicle unsuccessfull", res: "error", }]);
          } else {
              const vehicleData = await vehicle.findOne({ _id: mongoose.Types.ObjectId(vehicleId) }).populate('expenses');
              return res.status(200)
                  .json([{ msg: "Expenses Updated successfully", data: vehicleData, res: "success" }]);
          }
    }  catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};


module.exports = { save, getAll, update, remove, addExpenseReport };