const joi = require('joi');

const validation = joi.object({
    callType: joi.string().required(),
    purpose: joi.string().required(),
    name: joi.string().required(),
    mobileNo: joi.string().required(),
    date: joi.date(),
    timeSlotTo: joi.string(),
    timeSlotFrom: joi.string(),
    followUpDate: joi.date(),
    note: joi.string()
});

const callLogValidator = async (req, res, next) => {
	const { error } = validation.validate(req.body);
	if (error) {
		res.status(422);
		return res.json({ message: `Error in Call Log Data : ${error.message}`, success: false });
	} else {
		next();
	}
};

module.exports = callLogValidator;