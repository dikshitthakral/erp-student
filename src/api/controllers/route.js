const { v4 : uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const route = require('../models/route');

const save = async (req, res) => {
    try {
        let payload = {
            ...req.body,
            routeId: uuidv4()
        }
        let response = await route.create(payload);
        return res.status(200).json({
            route: response,
            message: "Added new Route successfully",
            success: true,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const getAll = async (req, res) => {
    try {
        let routes = await route.find();
        if (routes) {
           return res.status(200).send({
                routes ,
                messge: "All Routes",
                success: true,
            });
        } 
          
        return res.status(200).send({
            messge: "Routes does not exist",
            success: false,
        });
    }   catch (error) {
        return res.status(400).json({ message: error.message, success: false });
    }
};

const update = async (req, res) => {
    try {
        const routeId = req.params['id'];
        const payload = req.body;
        const routeObj = await route.findOne({ routeId });
        if(routeObj === null || routeObj === undefined || routeObj === '') {
            return res.status(400).json({
                message: "Route not found in system",
                success: true,
            });
        }

        let response = await route.findOneAndUpdate(
            { routeId },
            payload
        );

        if (response) {
            return res.status(200).json({
                message: "Route updated successfully",
                success: true,
            });
        }
        
        return res.status(200).json({ 
            msg: "Route not found!!!",
            res: "error" 
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const remove = async (req, res) => {
    try {
        const routeId = req.params['id'];
        let deleteRoute = await route.deleteOne({ routeId });
        if (deleteRoute["deletedCount"] === 1) {
            return res.status(200).json({
                routeId,
                message: "Route Deleted Successfully !!! ",
                success: true,
            });
        }

        return res.status(404).json({
            routeId,
            message: "Route Not found ",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}


module.exports = { save, getAll, update, remove };