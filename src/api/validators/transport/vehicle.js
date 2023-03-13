const joi = require('joi');
let object = joi.object().keys({
	name: joi.string(),
	value: joi.number(),
	time: joi.string(),
	description: joi.string(),
	attachement1:  joi.string(),
	attachement2:  joi.string(),
	attachement3:  joi.string(),
});

const validation = joi.object({
    vehicleNo: joi.string().trim(true).required(), 
    capacity: joi.number().required(),
    insuranceRenewalDate:joi.date().required(),
    driverName: joi.string().trim(true).required(),    
    driverPhoneNo:joi.string().trim(true).required(),
    driverLicense: joi.string().trim(true).required(),
});

const vehicleValidator = async (req, res, next) => {
	const { error } = validation.validate(req.body);
	if (error) {
		res.status(422);
		return res.json({ message: `Error in Vehicle Data : ${error.message}`, success: false });
	} else {
		next();
	}
};

module.exports = vehicleValidator;