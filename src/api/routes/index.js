const express = require('express');
const studentsController = require('../controllers/students');
const categoryController = require('../controllers/category');
const { routeController, stoppageController, vehicleController, vehicleRouteController } = require('../controllers/transport');
const { enquiryController, callLogController, visitorLogController } = require('../controllers/reception');
const { certificateController } = require('../controllers/certificate');
const departmentController = require('../controllers/department');
const designationController = require('../controllers/designation');
const employeeController = require('../controllers/employee');
const academicController = require('../controllers/academic');
const subjectController = require('../controllers/subject');
const scheduleController = require('../controllers/schedule');
const homeworkController = require('../controllers/homework');
const gradeController = require('../controllers/grade');
const examController = require('../controllers/exam');
const marksController = require('../controllers/marks');
const { routeValidator, stoppageValidator, vehicleValidator, vehicleRouteValidator } = require('../validators/transport');
const { enquiryValidator, callLogValidator, visitorLogValidator } = require('../validators/reception');
const certificateValidator = require('../validators/certificate/certificate');
const { feeTypeController, feeGroupController, fineSetupController } = require('../controllers/studentAccounting');
const { salaryController, salaryReceiptController, leavesCategoryController, leavesRequestController, awardController } = require('../controllers/humanResources');
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

//Transport-Route
router.post('/route', routeValidator, routeController.save);
router.get('/route/all', routeController.getAll);
router.put('/route/:id', routeValidator, routeController.update);
router.delete('/route/:id', routeController.remove);
//Transport-Stoppage
router.post('/stoppage', stoppageValidator, stoppageController.save);
router.get('/stoppage/all', stoppageController.getAll);
router.put('/stoppage/:id', stoppageValidator, stoppageController.update);
router.delete('/stoppage/:id', stoppageController.remove);
//Transport-VehicleRoute
router.post('/vehicleroute', vehicleRouteValidator, vehicleRouteController.save);
router.get('/vehicleroute/all', vehicleRouteController.getAll);
router.put('/vehicleroute/:id', vehicleRouteValidator, vehicleRouteController.update);
router.delete('/vehicleroute/:id', vehicleRouteController.remove);
//Transport-Vehicle
router.post('/vehicle', vehicleValidator, vehicleController.save);
router.get('/vehicle/all', vehicleController.getAll);
router.put('/vehicle/:id', vehicleValidator, vehicleController.update);
router.delete('/vehicle/:id', vehicleController.remove);

//Department Routes
router.post('/department',departmentController.create);
router.get('/department/all',departmentController.getAll);
router.delete('/department/:id',departmentController.remove);
router.put('/department',departmentController.update);

//Reception-Enquiry
router.post('/enquiry', enquiryValidator, enquiryController.save);
router.put('/enquiry/:id', enquiryValidator, enquiryController.update);
router.get('/enquiry/all', enquiryController.getAll);
router.delete('/enquiry/:id', enquiryController.remove);
//Reception-CallLog
router.post('/calllog', callLogValidator, callLogController.save);
router.put('/calllog/:id', callLogValidator, callLogController.update);
router.get('/calllog/all', callLogController.getAll);
router.delete('/calllog/:id', callLogController.remove);
//Reception-CallLog
router.post('/visitorlog', visitorLogValidator, visitorLogController.save);
router.put('/visitorlog/:id', visitorLogValidator, visitorLogController.update);
router.get('/visitorlog/all', visitorLogController.getAll);
router.delete('/visitorlog/:id', visitorLogController.remove);

//Certificate
router.post('/certificate', upload.fields([{ name: 'signatureImage', maxCount: 1 }, { name: 'logoImage', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]), certificateValidator, certificateController.save);
router.put('/certificate/:id', upload.fields([{ name: 'signatureImage', maxCount: 1 }, { name: 'logoImage', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]), certificateController.update);
router.get('/certificate/all', certificateController.getAll);
router.delete('/certificate/:id', certificateController.remove);
router.get('/certificate/student', certificateController.getStudentCertificate);
router.get('/certificate/employee', certificateController.getEmployeeCertificate);

//Designation Routes
router.post('/designation',designationController.create);
router.get('/designation/all',designationController.getAll);
router.delete('/designation/:id',designationController.remove);
router.put('/designation',designationController.update);

// Employee Routes
router.post('/employee', upload.single('file'), employeeController.save);
router.get('/employee/all', employeeController.getAll);
router.delete('/employee/:id', employeeController.remove);
router.put('/employee', upload.single('file'), employeeController.update);
router.post('/employee/uploadcsv', upload.single('file'), employeeController.bulkSave);
router.get('/employee/designation/:designationId', employeeController.getByDesignation);
router.put('/employee/salaryGrade', employeeController.updateSalaryGradeForEmployee);

// Academic Routes
router.post('/academic',academicController.create);
router.get('/academic/all',academicController.getAll);
router.delete('/academic/:id',academicController.remove);
router.put('/academic',academicController.update);
router.put('/academic/subject/add', academicController.addSubject);
router.put('/academic/subject/remove', academicController.removeSubject);
// Subject Routes
router.post('/subject',subjectController.create);
router.get('/subject/all',subjectController.getAll);
router.delete('/subject/:id',subjectController.remove);
router.put('/subject',subjectController.update);

// Schedule Routes
router.post('/schedule',scheduleController.add);
router.get('/schedule/:id',scheduleController.getSchedule);
router.post('/schedule/academics',scheduleController.getScheduleByAcademics);
router.post('/schedule/academics/:day',scheduleController.getScheduleDayByAcademics);
router.post('/schedule/teacher',scheduleController.getScheduleByTeacher);

// Homework Routes
router.post('/homework', upload.single('file'), homeworkController.create);
router.get('/homework/all', homeworkController.getAll);
router.delete('/homework/:id', homeworkController.remove);
router.put('/homework', upload.single('file'), homeworkController.update);

// Grade routes
router.post('/grade', gradeController.create);
router.get('/grade/all', gradeController.getAll);
router.delete('/grade/:id', gradeController.remove);
router.put('/grade', gradeController.update);

//Exam routes
router.post('/exam', examController.create);
router.get('/exam/all', examController.getAll);
router.delete('/exam/:id', examController.remove);
router.put('/exam', examController.update);
// Marks Routes
router.post('/marks', marksController.create);
router.get('/marks/all', marksController.getAll);
router.delete('/marks/:id', marksController.remove);
router.put('/marks', marksController.update);
//Student Accounting
router.post('/feeType', feeTypeController.create);
router.get('/feeType/all', feeTypeController.getAll);
router.delete('/feeType/:id', feeTypeController.remove);
router.put('/feeType', feeTypeController.update);

router.post('/feeGroup', feeGroupController.create);
router.get('/feeGroup/all', feeGroupController.getAll);
router.delete('/feeGroup/:id', feeGroupController.remove);
router.put('/feeGroup', feeGroupController.update);
router.put('/feeGroup/feeType/add', feeGroupController.addFeeType);
router.put('/feeGroup/feeType/remove', feeGroupController.removeFeeType);

router.post('/fineSetup', fineSetupController.create);
router.get('/fineSetup/all', fineSetupController.getAll);
router.delete('/fineSetup/:id', fineSetupController.remove);
router.put('/fineSetup', fineSetupController.update);
router.post('/student/allocate', studentsController.addFeesStructure);
router.post('/student/fees/all', studentsController.searchStudentsFeeByAcademics);
router.put('/student/fees/:studentId', studentsController.updateFeeStatus);

// Human Resources
router.post('/salary', salaryController.add);
router.get('/salary/all', salaryController.getAll);
router.get('/salary/receipt/:id', salaryController.getById);
router.delete('/salary/:id', salaryController.remove);
router.put('/salary', salaryController.update);
router.post('/salaryReceipt', salaryReceiptController.add);
router.get('/salaryReceipt/:salaryPaidMonth', salaryReceiptController.getSalaryReceiptByMonth);
// Leaves
router.post('/leavesCategory', leavesCategoryController.create);
router.get('/leavesCategory/all', leavesCategoryController.getAll);
router.delete('/leavesCategory/:id', leavesCategoryController.remove);
router.put('/leavesCategory', leavesCategoryController.update);
// LeavesRequest
router.post('/leavesRequest', upload.single('file'), leavesRequestController.create);
router.get('/leavesRequest/all', leavesRequestController.getAll);
router.delete('/leavesRequest/:id', leavesRequestController.remove);
router.put('/leavesRequest/status', leavesRequestController.updateStatus);
router.get('/employee/leavesRequest/:designationId', employeeController.getAllLeavesRequestByDesignation);
// Award
router.post('/award', awardController.create);
router.get('/award/all', awardController.getAll);
router.delete('/award/:id', awardController.remove);
router.put('/award', awardController.update);

module.exports = router;