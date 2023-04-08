const mongoose = require('mongoose');
const certificate = require('../../models/certificate/certificate');
const storage = require('../../services/storage');
const util = require("util");
const fs = require("fs");
const { isEmpty } = require('lodash');

const documents = ['signatureImage', 'logoImage', 'backgroundImage'];

const uploadDocuments = async (files) =>{
    const uploadedLocations = {};
    const unlinkFile = util.promisify(fs.unlink);
    for(let document of documents) {
        const file = files[document] ? files[document][0] : undefined;
        if(isEmpty(file)) { continue; }
        const location = await storage.uploadFile(file);
        // Deleting from local if uploaded in S3 bucket
        await unlinkFile(file.path);
        uploadedLocations[document] = location;
    }
    return uploadedLocations;
}

const save = async (req, res) => {
    try {  
        const body = req.body;
        const files = req?.files;
        let uploadedLocations = {};
        if(!isEmpty(files)) {
            uploadedLocations = await uploadDocuments(files);
        }
        let response = await certificate.create({...body, ...uploadedLocations});
        return res.status(200).json({
            callLog: response,
            message: "Added New Certificate Successfully",
            success: true,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const update = async (req, res) => {
    try {
        const id = req.params['id'];
        let uploadedLocations = {};
        if(!isEmpty(files)) {
            uploadedLocations = await uploadDocuments(files);
        }
        let response = await certificate.findOneAndUpdate(
            { _id : mongoose.Types.ObjectId(id) },
            {...req.body, ...uploadedLocations}
        );

        if (response) {
            return res.status(200).json({
                message: "Certificate updated Successfully",
                success: true,
            });
        }
        
        return res.status(404).json({ 
            msg: "Certificate not found!!!",
            res: "error" 
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const getAll = async (req, res) => {
    try {  
        let certificates = await certificate.find({});
        if (certificates) {
           return res.status(200).send({
                certificates,
                messge: "All Certificate",
                success: true,
            });
        } 
          
        return res.status(200).send({
            messge: "Certificate does not exist",
            success: false,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const remove = async (req, res) => {
    try {
        const id = req.params['id'];
        let deleteCertificate = await certificate.deleteOne({ _id : mongoose.Types.ObjectId(id) });
        if (deleteCertificate["deletedCount"] === 1) {
            return res.status(200).json({
                id,
                message: "Certificate Deleted Successfully !!! ",
                success: true,
            });
        }

        return res.status(404).json({
            id,
            message: "Certificate Not found ",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

const getStudentCertificate = async (req, res) => {
    try {  
        const studentClass = req.query['class'];
        const section = req.query['section'];
        const template = req.query['template'];

        const matchQuery = [];
        const queryList = [
            {'applicableStudent': {$exists:true} },
        ]

        if(template) {
            queryList.push({ _id : mongoose.Types.ObjectId(template) })
        }
        if(studentClass) {
            matchQuery.push({ 'studentClass' : {$eq: studentClass } })
        }
        if(section) {
            matchQuery.push({ 'section' : {$eq: section } })
        }
        
        let certificates = await certificate.find({$and: queryList })
        .populate({ 
            path: 'applicableStudent', 
            select: 'registerNo firstName lastName category number',
            populate: {
                path: 'academic',
                model: 'Academic',
                match: { $and: matchQuery }, 
            },
        });
        
        if (certificates) {
           return res.status(200).send({
                certificates,
                messge: "All Student Certificate",
                success: true,
            });
        } 
          
        return res.status(200).send({
            messge: "Student Certificate does not exist",
            success: false,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

const getEmployeeCertificate = async (req, res) => {
    try {  
        const role = req.query['role'];
        const template = req.query['template'];

        const matchQuery = [];
        const queryList = [
            {'applicableEmployee': {$exists:true} },
        ]

        if(template) {
            queryList.push({ _id : mongoose.Types.ObjectId(template) })
        }
        if(role) {
            matchQuery.push({ 'name' : {$eq: role } });
        }
        
        let certificates = await certificate.find({$and: queryList })
        .populate({ 
            path: 'applicableEmployee', 
            select: 'name number',
            populate: {
                path: 'designation',
                model: 'Designation',
                match: {$and: matchQuery}
            }
        }).populate({ 
            path: 'applicableEmployee', 
            select: 'name number',
            populate: {
                path: 'department',
                model: 'Department',
            }
        });
        
        if (certificates) {
           return res.status(200).send({
                certificates,
                messge: "All Employee Certificate",
                success: true,
            });
        } 
          
        return res.status(200).send({
            messge: "Employee Certificate does not exist",
            success: false,
        });
    }   catch(err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};

module.exports = { save, update, getAll, remove, getStudentCertificate, getEmployeeCertificate };