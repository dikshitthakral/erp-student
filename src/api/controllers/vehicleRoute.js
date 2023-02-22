const { v4 : uuidv4 } = require('uuid');
const vehicleRoute = require('../models/vehicleRoute');
const route = require('../models/route');
const stoppage = require('../models/stoppage');
const vehicle = require('../models/vehicle');
const mongoose = require('mongoose');

const validateVehicleRoute = async (routeId, stoppageId, vehicleId, res) => {
    const promises = [
        route.findOne({ routeId }),
        stoppage.findOne({ stoppageId }),
        vehicle.findOne({ vehicleId })
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
        
        const payload = { 
            ...req.body, 
            vehicleRouteId: uuidv4()
        };
        let response = await vehicleRoute.create(payload);
        return res.status(200).json({
            vehicleRoute: response,
            message: "Added New Vehicle Route Successfully",
            success: true,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const getAll = async (req, res) => {
    try {
        let vehicleRoutes = await vehicleRoute.aggregate([
            {
               "$lookup":{
                  "from":"routes",
                  "localField":"routeId",
                  "foreignField":"routeId",
                  "as":"route_info"
               }
            },
            { "$unwind" : "$route_info" },
            {
               "$lookup":{
                  "from":"vehicles",
                  "localField":"vehicleId",
                  "foreignField":"vehicleId",
                  "as":"vehicle_info"
               }
            } ,
            { "$unwind" : "$vehicle_info" },
            {
               "$lookup":{
                  "from":"stoppages",
                  "localField":"stoppageId",
                  "foreignField":"stoppageId",
                  "as":"stoppage_info"
               }
            },
            { "$unwind" : "$stoppage_info" },
            {
                "$project" :{
                    "routeId": 1,
                    "vehicleId": 1,
                    "stoppageId": 1,
                    "vehicleRouteId": 1,
                    "routeName": "$route_info.routeName",
                    "startPlace": "$route_info.startPlace",
                    "stopPlace": "$route_info.stopPlace",
                    "stoppageName": "$stoppage_info.stoppageName",
                    "stopTime": "$stoppage_info.stopTime",
                    "routeFare": "$stoppage_info.routeFare",
                    "vehicleNo": "vehicle_info.vehicleNo",
                }
            }   
        ]);
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
        return res.status(400).json({ message: error.message, success: false });
    }
};

const update = async (req, res) => {
    try {
        const vehicleRouteId = req.params['id'];
        const { routeId, stoppageId, vehicleId } = req.body;
        const vehicleRouteObj = await vehicleRoute.findOne({ vehicleRouteId });
        if(!vehicleRouteObj) {
            return res.status(400).json({
                message: "Vehicle Route not found in system",
                success: true,
            });
        }
        const isValid = await validateVehicleRoute(routeId, stoppageId, vehicleId);
        if(!isValid) {
            return res.status(200).json({
                message: 'Route / Stoppage / Vehicle not found',
                success: false,
            });
        }

        const payload = { routeId, stoppageId, vehicleId };
        let response = await vehicleRoute.findOneAndUpdate(
            { vehicleRouteId },
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
        return res.status(500).json({ message: err.message, success: false });
    }
};

const remove = async (req, res) => {
    try {
        const vehicleRouteId = req.params['id'];
        let deleteVehicleRoute = await vehicleRoute.deleteOne({ vehicleRouteId });
        if (deleteVehicleRoute["deletedCount"] === 1) {
            return res.status(200).json({
                vehicleRouteId,
                message: "Vehicle Route Deleted Successfully !!! ",
                success: true,
            });
        }

        return res.status(404).json({
            vehicleRouteId,
            message: "Vehicle Route Not found ",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = { save, getAll, update, remove }; 