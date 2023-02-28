const { vehicleRouteModel , routeModel , stoppageModel , vehicleModel } = require('../../models/transport');
const mongoose = require('mongoose');

const getVehicleRoute = async (routeId, stoppageId, vehicleId) => {
    try{
        const promises = [
            routeModel.findOne({ _id : mongoose.Types.ObjectId(routeId) }),
            stoppageModel.findOne({ _id : mongoose.Types.ObjectId(stoppageId) }),
            vehicleModel.findOne({ _id : mongoose.Types.ObjectId(vehicleId) })
        ];
        const [route, stoppage, vehicle] = await Promise.all(promises);
    
        if(!route || !stoppage || !vehicle ) {
            return null;
        }
        return { route, stoppage, vehicle };
    } catch(error) {
        throw new Error('Error while getting route/stoppage/vehicle');
    }
};

const save = async (req, res) => {
    try {
        const { route, stoppage, vehicle } = req.body;
        const vehicleRoute = await getVehicleRoute(route, stoppage, vehicle);
        if(!vehicleRoute) {
            return res.status(200).json({
                message: 'Route / Stoppage / Vehicle not found',
                success: false,
            });
        }
        const payload = { 
            route: mongoose.Types.ObjectId(vehicleRoute["route"]._id), 
            stoppage: mongoose.Types.ObjectId(vehicleRoute["stoppage"]._id),
            vehicle: mongoose.Types.ObjectId(vehicleRoute["vehicle"]._id),
        };
        let response = await vehicleRouteModel.create(payload);
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
        let vehicleRoutes = await vehicleRouteModel.find()
        .populate({ path: 'route', select: 'routeName startPlace stopPlace' })
        .populate({ path: 'stoppage', select: 'stoppageName stopTime routeFare' })
        .populate({ path: 'vehicle', select: 'vehicleNo' });
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
        const id = req.params['id'];
        const { route, stoppage, vehicle } = req.body;
        const vehicleRoute = await getVehicleRoute(route, stoppage, vehicle);
        if(!vehicleRoute) {
            return res.status(200).json({
                message: 'Route / Stoppage / Vehicle not found',
                success: false,
            });
        }
        const payload = { 
            route: mongoose.Types.ObjectId(vehicleRoute["route"]._id), 
            stoppage: mongoose.Types.ObjectId(vehicleRoute["stoppage"]._id),
            vehicle: mongoose.Types.ObjectId(vehicleRoute["vehicle"]._id),
        };
        let response = await vehicleRouteModel.findOneAndUpdate(
            { _id : mongoose.Types.ObjectId(id) },
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
        let deleteVehicleRoute = await vehicleRouteModel.deleteOne({ _id : mongoose.Types.ObjectId(vehicleRouteId) });
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