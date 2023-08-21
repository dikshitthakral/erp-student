const express = require('express');
const studentsController = require('../controllers/students');
const categoryController = require('../controllers/category');
const { routeController, stoppageController, vehicleController, vehicleRouteController,transportFeeController } = require('../controllers/transport');
const { enquiryController, callLogController, visitorLogController } = require('../controllers/reception');
const { certificateController } = require('../controllers/certificate');
const departmentController = require('../controllers/department');
const designationController = require('../controllers/designation');
const employeeController = require('../controllers/employee');
const academicController = require('../controllers/academic');
const subjectController = require('../controllers/subject');
const scheduleController = require('../controllers/schedule');
const typeController = require('../controllers/type');
const homeworkController = require('../controllers/homework');
const gradeController = require('../controllers/grade');
const examController = require('../controllers/exam');
const examTermController = require('../controllers/examTerm');
const marksDistributionController = require('../controllers/marksDistribution');
const marksController = require('../controllers/marks');
const { routeValidator, stoppageValidator, vehicleValidator, vehicleRouteValidator } = require('../validators/transport');
const { enquiryValidator, callLogValidator, visitorLogValidator } = require('../validators/reception');
const { certificateValidator } = require('../validators/certificate/certificate');
const { feeTypeController, feeGroupController, fineSetupController,feeCategoryController,academicFeeTypeController,feeModeController,promotionController } = require('../controllers/studentAccounting');
const { salaryController, salaryReceiptController, leavesCategoryController, leavesRequestController, awardController, advanceSalaryController } = require('../controllers/humanResources');
const router = express.Router();
const upload = require("../../common");
const guardianController = require('../controllers/guardian');
const sectionController = require('../controllers/section');
const classController = require('../controllers/class');
const noticeBoardController = require('../controllers/noticeBoard');
const homeworkSubmissionController = require('../controllers/homework-submission');
const attendanceController = require('../controllers/attendance');
const employeeAttendanceController = require('../controllers/employeeAttandance');
const studentAttendance = require('../controllers/studentAttandance');
const raiseATicketController = require('../controllers/raiseATicket');
const bannerController = require('../controllers/banner');
const notificationController = require('../controllers/notification');
const route = require('../models/transport/route');
const principalDailyReportController = require('../controllers/principalDailyReport');
const queriesController = require('../controllers/query');

// Queries Routes
router.post('/query/add', upload.single('file'),queriesController.addQuestion);
router.put('/query/answer/add', upload.single('file'),queriesController.updateAnswer);
router.get('/query/fetch/:id',queriesController.getById);
router.get('/query/all',queriesController.getAll);
router.get('/query/teacher/:teacherId', queriesController.getByTeacher);
router.get('/query/teacher/:teacherId/student/:studentId', queriesController.getByTeacherAndStudent);
router.get('/query/student/:studentId', queriesController.getQueriesByStudent);
// Students Routes
router.post('/student/upload', upload.single('file'),studentsController.uploadImage);
router.post('/student/admission', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'idCardDocument', maxCount: 1 }, { name: 'guardian.image', maxCount: 1 }, { name: 'guardian.idProofDocument', maxCount: 1 }]), studentsController.createAdmission);
router.post('/student/uploadcsv', upload.single('file'), studentsController.createBulkAdmission);
router.get('/student/fetch/:id',studentsController.getById);
router.get('/student/all',studentsController.getAllStudents);
router.post('/student/search', studentsController.searchByAcademics);
router.delete('/student/:id',studentsController.remove);
router.delete('/student/:academicYear/:section/:studentClass',studentsController.removeMultiple);
router.post('/student/generateCsv', studentsController.generateCsv);
router.put('/student/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'idCardDocument', maxCount: 1 }, { name: 'guardian.image', maxCount: 1 }, { name: 'guardian.idProofDocument', maxCount: 1 }]), studentsController.updateStudent);
router.post('/guardian/login', studentsController.guardianLogin);
router.post('/student/classYear',studentsController.searchByClassYear);

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
router.post('/vehicle/expense',upload.fields([{ name: 'expenseDocs1', maxCount: 1 }, { name: 'expenseDocs2', maxCount: 1 }, { name: 'expenseDocs3', maxCount: 1 }]),  vehicleController.addExpenseReport);
router.put('/vehicle/expense/:expenseId',upload.fields([{ name: 'expenseDocs1', maxCount: 1 }, { name: 'expenseDocs2', maxCount: 1 }, { name: 'expenseDocs3', maxCount: 1 }]),  vehicleController.updateExpenseReport);
router.delete('/vehicle/:id/expense/:expenseId', vehicleController.deleteExpenseFromVehicle);
router.get('/vehicle/:id', vehicleController.getExpenseByVehicle);

//Transport-Fee
router.post('/transportfee/create', transportFeeController.create);
router.get('/transportfee/all', transportFeeController.getAll);
router.post('/transportfee/year', transportFeeController.getAllByYear);
router.put('/transportfee/update/:id', transportFeeController.update);
router.delete('/transportfee/delete/:id', transportFeeController.remove);

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
router.post('/certificate', upload.fields([{ name: 'signatureImage', maxCount: 1 }, { name: 'logoImage', maxCount: 1 } ,{ name: 'backgroundImage', maxCount: 1 }]), certificateValidator, certificateController.save);
router.put('/certificate/:id', upload.fields([{ name: 'signatureImage', maxCount: 1 }, { name: 'logoImage', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]), certificateController.update);
router.get('/certificate/all', certificateController.getAll);
router.get('/certificate/:applicableUser', certificateController.getByApplicableUser);
router.delete('/certificate/:id', certificateController.remove);
router.get('/certificate/student', certificateController.getStudentCertificate);
router.get('/certificate/employee', certificateController.getEmployeeCertificate);

//Designation Routes
router.post('/designation',designationController.create);
router.get('/designation/all',designationController.getAll);
router.delete('/designation/:id',designationController.remove);
router.put('/designation',designationController.update);
router.get('/allTeacher/:name',designationController.allTeacher);

// Employee Routes
router.post('/employee', upload.single('file'), employeeController.save);
router.get('/employee/all/:page/:designation?', employeeController.getAll);
router.delete('/employee/:id', employeeController.remove);
router.put('/employee', upload.single('file'), employeeController.update);
router.post('/employee/uploadcsv', upload.single('file'), employeeController.bulkSave);
router.get('/employee/designation/:designationId', employeeController.getByDesignation);
router.put('/employee/salaryGrade', employeeController.updateSalaryGradeForEmployee);
router.post('/employee/teacher/login', employeeController.employeeLogin);
router.post('/employee/admin/login', employeeController.adminLogin);

// Academic Routes
router.post('/academic',academicController.create);
router.get('/academic/all',academicController.getAll);
router.get('/academic/id/:id',academicController.getById);
router.delete('/academic/:id',academicController.remove);
router.put('/academic',academicController.update);
router.put('/academic/subjects/add', academicController.addSubject);
router.put('/academic/subject/remove', academicController.removeSubject);
router.put('/academic/teachers/add', academicController.addTeacher);
router.put('/academic/teacher/remove', academicController.removeTeacher);
router.post('/academic/details', academicController.getByAcademicDetails);

// Subject Routes
router.post('/subject',subjectController.create);
router.get('/subject/all',subjectController.getAll);
router.delete('/subject/:id',subjectController.remove);
router.put('/subject',subjectController.update);

// Schedule Routes
router.post('/schedule',scheduleController.add);
router.put('/schedule',scheduleController.update);
router.get('/schedule/:id',scheduleController.getSchedule);
router.post('/schedule/academics',scheduleController.getScheduleByAcademics);
router.post('/schedule/academics/:day',scheduleController.getScheduleDayByAcademics);
router.post('/schedule/student/:studentId/:day',scheduleController.getScheduleDayByStudent);
router.post('/schedule/teacher',scheduleController.getScheduleByTeacher);
router.post('/schedule/academics/teacher/all', scheduleController.getScheduleByAcademicAndTeacher)
// Homework Routes
router.post('/homework', upload.single('file'), homeworkController.create);
router.get('/homework/all', homeworkController.getAll);
router.get('/homework/:id', homeworkController.getHomeworkById);
router.delete('/homework/:id', homeworkController.remove);
router.put('/homework', upload.single('file'), homeworkController.update);
router.post('/homework/academic/day', homeworkController.getHomeworkByAcademic);
router.post('/homework/academic/range/search', homeworkController.getHomeworkByAcademicAndDateRange);
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
//Exam Term routes
router.post('/examTerm', examTermController.create);
router.get('/examTerm/all', examTermController.getAll);
router.delete('/examTerm/:id', examTermController.remove);
router.put('/examTerm', examTermController.update);
//Marks Distribution routes
router.post('/marksDistribution', marksDistributionController.create);
router.get('/marksDistribution/all', marksDistributionController.getAll);
router.delete('/marksDistribution/:id', marksDistributionController.remove);
router.put('/marksDistribution', marksDistributionController.update);
// Marks Routes
router.post('/marks', marksController.create);
router.get('/marks/all', marksController.getAll);
router.delete('/marks/:id', marksController.remove);
router.put('/marks', marksController.update);
router.post('/marks/student', marksController.getMarksByAcademicAndStudentId);
router.post('/marks/student/page/:page', marksController.getMarksByFilter);
router.put('/marks/students', marksController.updateMultiple);

//Student Accounting
router.post('/feeType', feeTypeController.create);
router.get('/feeType/all', feeTypeController.getAll);
router.get('/feeType/:id', feeTypeController.getById);
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
router.get('/fineSetup/:id', fineSetupController.getById);
router.delete('/fineSetup/:id', fineSetupController.remove);
router.put('/fineSetup', fineSetupController.update);
router.post('/student/allocate', studentsController.addFeesStructure);
router.post('/student/fees/all', studentsController.searchStudentsFeeByAcademics);
router.put('/student/fees/:studentId', studentsController.updateFeeStatus);

router.post('/createFeeCat', feeCategoryController.createFeeCategory);
router.get('/feeCategory/all', feeCategoryController.getAllFeeCategory);
router.delete('/delete/:id', feeCategoryController.deleteFeeCategory);
router.put('/updateFeeCategory/:id', feeCategoryController.updateFeeCategory);
router.get('/showacademicyear', feeCategoryController.createAcademicYear);

//academic fee type
router.post('/createfeetype', academicFeeTypeController.create);
router.get('/academicFeeType/all', academicFeeTypeController.getAll);
router.post('/getfeetype/year', academicFeeTypeController.getYearWise);
router.post('/feeData/classandyearWise', academicFeeTypeController.classAndYearWise);
router.post('/getClassandYearWise', academicFeeTypeController.getClassandYearWise);
router.post('/feeData/studentIdandyearWise', academicFeeTypeController.studentIdAndYearWise);
router.post('/getConcessionAmount', academicFeeTypeController.getConcessionAmount);
router.post('/createFeeConcession', academicFeeTypeController.createFeeConcession);
router.get('/feeDtailByStudent/:id', academicFeeTypeController.feeDtailByStudentID);
router.get('/getFeeDetailById/:id', academicFeeTypeController.getFeeDetailById);
router.put('/updateModeStatus', academicFeeTypeController.updateModeStatus);

// Fee Mode Routes
router.post('/createMonthType', feeModeController.createMonthType);
router.get('/getAllMode', feeModeController.allMode);
router.post('/createFeeMonth', feeModeController.createFeeMonth);
router.get('/allFeeMonth/:id', feeModeController.allFeeMonth);

// promotion routes
router.post('/promoteAll', promotionController.promoteAll);
router.post('/notPromoteAll', promotionController.notPromoteAll);

// Human Resources
router.post('/salary', salaryController.add);
router.get('/salary/all', salaryController.getAll);
router.get('/salary/receipt/:id', salaryController.getById);
router.delete('/salary/:id', salaryController.remove);
router.put('/salary', salaryController.update);
router.post('/salaryReceipt', salaryReceiptController.add);
router.get('/salaryReceipt/:salaryPaidMonth', salaryReceiptController.getSalaryReceiptsByMonthAndYear);
router.get('/salaryReceipt/employees/:employee', salaryReceiptController.getSalaryReceiptsOfEmployee);
router.get('/salaryReceipt/employee/:employee/:salaryPaidMonth', salaryReceiptController.getSalaryReceiptsByMonthAndEmployee);
// Advance Salary
router.post('/advanceSalary', advanceSalaryController.add);
router.get('/advanceSalary/all', advanceSalaryController.getAll);
router.get('/advanceSalary/receipt/:id', advanceSalaryController.getById);
router.delete('/advanceSalary/:id', advanceSalaryController.remove);
router.put('/advanceSalary', advanceSalaryController.update);
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
router.get('/employee/:id', employeeController.getById);
// Award
router.post('/award', awardController.create);
router.get('/award/all', awardController.getAll);
router.delete('/award/:id', awardController.remove);
router.put('/award', awardController.update);
// Reports
router.post('/students/filter/:type', studentsController.fetchStudentsByFilter);
router.post('/students/active/:status/academic', studentsController.fetchStudentsByStatus);
router.put('/students/status', studentsController.updateStatus);
router.post('/students/guardian/filter', guardianController.getStudentsWithSameGuardian);
router.get('/guardian/all', guardianController.getAll);
router.get('/guardian/userName/:userName', guardianController.getGuardianByUserName);
router.post('/students/promote', studentsController.promoteStudent);
router.get('/students/:studentId/marks', studentsController.fetchStudentMarks);
// Section
router.post('/section', sectionController.create);
router.get('/section/all', sectionController.getAll);
router.delete('/section/:id', sectionController.remove);
router.put('/section', sectionController.update);
// Class
router.post('/class', classController.create);
router.get('/class/all', classController.getAll);
router.delete('/class/:id', classController.remove);
router.put('/class', classController.update);
// NoticeBoard
router.post('/noticeBoard', upload.single('file'), noticeBoardController.create);
router.get('/noticeBoard/:type', noticeBoardController.getAll);
router.get('/allNoticeBoard', noticeBoardController.getAllNoticeBoard);
router.get('/getById/:id', noticeBoardController.getById);
router.delete('/noticeBoard/delete', noticeBoardController.remove);
// Homework Submissions
router.post('/homework-submission', upload.single('file'), homeworkSubmissionController.create);
router.get('/homework-submission/:homeworkId', homeworkSubmissionController.getAllSubmissionByHomeworkId);
router.post('/homework-submission/filter', homeworkSubmissionController.getHomeworkSubmissionByFilter)

// Attendance
router.post('/attendance', attendanceController.create);
router.post('/attendance/student/dates', attendanceController.getAttendanceByDate);
router.delete('/attendance/:id', attendanceController.remove);
router.put('/attendance', attendanceController.update);
// Raise A Ticket
router.post('/raiseTicket', raiseATicketController.create);
router.get('/raiseTicket/:type', raiseATicketController.getAll);
router.delete('/raiseTicket/delete', raiseATicketController.remove);
router.put('/raiseTicket/status', raiseATicketController.updateStatus);

// Student Vechile Routes
router.post('/student/vehicleRoutes/search', studentsController.searchStudentRoutesByAcademics);
router.post('/student/vehicleRoutes', studentsController.addVehicleRoute);
router.delete('/student/:studentId/vehicleRoutes/remove', studentsController.removeVehicleRoute);

// Banner Routes
router.post('/banner', upload.single('file'), bannerController.createBanner);
router.get('/bannerAll', bannerController.getAllBanner);
router.delete('/banner/delete', bannerController.deleteBannerById);

//Notification Routes
router.post('/createNotification', notificationController.createNotification);
router.get('/notification/:type', notificationController.getAllNotification);
router.get('/notificationAll', notificationController.allNotification);
router.delete('/notification/delete', notificationController.deleteNotificationById);

// Student Attendance
router.post('/createAttandance', studentAttendance.create);
router.get('/getAllAttandance', studentAttendance.getAll);
router.post('/halfDayStudent', studentAttendance.getAllByHalfdayList);
router.post('/getAllAbsentList', studentAttendance.getAllAbsentList);
router.post('/showAttandanceList', studentAttendance.getAllAttandance);
router.post('/getAllStudent', studentAttendance.getAllStudent);
router.post('/filterStudent/attandance', studentAttendance.filterAttandanceStudent);
router.post('/studentAttandancebyid', studentAttendance.getAttandaceDetail);

// Employee Attendance
router.post('/empAttandance/filter', employeeAttendanceController.filter);
router.post('/empAttandance/create', employeeAttendanceController.add);
router.post('/filteremp/attandance', employeeAttendanceController.filterByMonth);

// principal daily report routes
router.post('/createReport', principalDailyReportController.create);
router.post('/getReportByDate', principalDailyReportController.getReportByDate);

// Type
router.post('/createType', typeController.create);
router.get('/type/all', typeController.getAll);
router.delete('/type/:id', typeController.remove);
router.put('/updateType', typeController.update);

module.exports = router;
