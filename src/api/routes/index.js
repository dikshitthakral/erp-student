const express = require('express');
const studentsController = require('../controllers/students');
const categoryController = require('../controllers/category');
const router = express.Router();
const upload = require("../../common");

// Students Routes
router.post('/student/upload', upload.single('file'),studentsController.uploadImage);
router.post('/student/admission', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'idCardDocument', maxCount: 1 }, { name: 'guardian.image', maxCount: 1 }, { name: 'guardian.idProofDocument', maxCount: 1 }]), studentsController.createAdmission);
router.post('/student/uploadcsv', upload.single('file'), studentsController.createBulkAdmission);
router.get('/student/all',studentsController.getAllStudents);
router.post('/student/search', studentsController.searchByAcademics);
router.delete('/student/:id',studentsController.remove);
router.delete('/student/:academicYear/:section/:studentClass',studentsController.removeMultiple);
router.post('/student/generateCsv', studentsController.generateCsv);
router.put('/student/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'idCardDocument', maxCount: 1 }, { name: 'guardian.image', maxCount: 1 }, { name: 'guardian.idProofDocument', maxCount: 1 }]), studentsController.updateStudent);
// Category Routes
router.post('/category',categoryController.save);
router.get('/category/all',categoryController.getAll);
router.delete('/category/:id',categoryController.remove);
router.put('/category',categoryController.update);
// BooksIssue Routes

module.exports = router;