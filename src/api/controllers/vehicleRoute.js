const vehicleRoute = require('../models/vehicleRoute');
const route = require('../models/route');
const stoppage = require('../models/stoppage');
const vehicle = require('../models/vehicle');
const mongoose = require('mongoose');

const validateVehicleRoute = async (routeId, stoppageId, vehicleId, res) => {
    const promises = [
        route.findById({_id: mongoose.Types.ObjectId(routeId)}),
        stoppage.findById({_id: mongoose.Types.ObjectId(stoppageId)}),
        vehicle.findById({_id: mongoose.Types.ObjectId(vehicleId)})
    ];
    const [routeObj, stoppageObj, vehicleObj] = await Promise.all(promises);

    if(!routeObj || !stoppageObj || !vehicleObj ) {
        return false;
    }
    return true;
}

const save = async (req, res) => {
    try {
        const { routeId, stoppageId, vehicleId } = req.body;
        const isValid = await validateVehicleRoute(routeId, stoppageId, vehicleId);
        if(!isValid) {
            return res.status(200).json({
                message: 'Route / Stoppage / Vehicle not found',
                success: false,
            });
        }
        
        const payload = { routeId, stoppageId, vehicleId };
        let response = await vehicleRoute.create(payload);
        return res.status(200).json({
            vehicleRoute: response,
            message: "Added New Vehicle Route Successfully",
            success: true,
        });
    }   catch(err) {
        console.log('err', err);
        return res.status(500).json({ message: err.message, success: false });
    }
};

const getAll = async (req, res) => {
    try {
        let vehicleRoutes = await vehicleRoute.find();
        if (vehicleRoutes) {
           return res.status(200).send({
                vehicleRoutes ,
                messge: "All Vehicle Routes",
                success: true,
            });
        } 
          
        return res.status(200).send({
            messge: "Vehicle Routes does not exist",
            success: false,
        });
    }   catch (error) {
        return res.status(400).json({ message: err.message, success: false });
    }
};

const update = async (req, res) => {
    try {
        const id = req.params['id'];
        const { routeId, stoppageId, vehicleId } = req.body;
        const isValid = await validateVehicleRoute(routeId, stoppageId, vehicleId);
        if(!isValid) {
            return res.status(200).json({
                message: 'Route / Stoppage / Vehicle not found',
                success: false,
            });
        }

        const payload = { routeId, stoppageId, vehicleId };
        let response = await vehicleRoute.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            payload
        );

        if (response) {
            return res.status(200).json({
                message: "Vehicle Route updated successfully",
                success: true,
            });
        }
        
        return res.status(200).json([{ 
            msg: "Vehicle Route not found!!!",
            res: "error" 
        }]);
    }   catch(err) {
        console.log('err', err);
        return res.status(500).json({ message: err.message, success: false });
    }
};

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        let deleteVehicleRoute = await vehicleRoute.deleteOne({ _id: id });
        if (deleteVehicleRoute["deletedCount"] === 1) {
            return res.status(200).json({
                id,
                message: "Vehicle Route Deleted Successfully !!! ",
                success: true,
            });
        }

        return res.status(404).json({
            id,
            message: "Vehicle Route Not found ",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

module.exports = { save, getAll, update, remove }; 