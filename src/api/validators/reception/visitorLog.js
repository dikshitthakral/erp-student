const joi = require('joi');

const validation = joi.object({
    visitingPuprose: joi.string().required(),
    name: joi.string().required(),
    mobileNo: joi.string().required(),
    date: joi.date(),
    entryTime: joi.string(),
    exitTime: joi.string(),
    noOfVisitors: joi.number(),
    idNumber: joi.string(),
    token: joi.string(),
    note: joi.string()
});

const visitorLogValidator = async (req, res, next) => {
	const { error } = validation.validate(req.body);
	if (error) {
		res.status(422);
		return res.json({ message: `Error in Visitor Log Data : ${error.message}`, success: false });
	} else {
		next();
	}
};

module.exports = visitorLogValidator;