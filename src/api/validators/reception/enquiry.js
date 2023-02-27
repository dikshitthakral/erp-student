const joi = require('joi');

const validation = joi.object({
    name: joi.string().required(), 
    gender: joi.string().required(), 
    dob: joi.date().required(),
    previousSchool: joi.string(),
    fatherName: joi.string().required(),
    motherName: joi.string().required(),
    mobileNo: joi.string().required(),
    email: joi.string().required(),
    address: joi.string(),
    noOfChild: joi.number(),
    assigned: joi.string().required(),
    reference: joi.string(),
    response: joi.string().required(),
    note: joi.string(),
    dateOfEnquiry: joi.date(),
    classApplyFor: joi.string().required(),
});

const enquiryValidator = async (req, res, next) => {
	const { error } = validation.validate(req.body);
	if (error) {
		res.status(422);
		return res.json({ message: `Error in Enquiry Data : ${error.message}`, success: false });
	} else {
		next();
	}
};

module.exports = enquiryValidator;