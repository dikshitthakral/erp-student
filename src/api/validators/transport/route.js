const joi = require('joi');

const validation = joi.object({
    routeName: joi.string().trim(true).required(), 
    startPlace: joi.string().trim(true).required(),
    stopPlace:joi.string().trim(true).required(),
    remarks: joi.string().trim(true)
});

const routeValidator = async (req, res, next) => {
	const { error } = validation.validate(req.body);
	if (error) {
		res.status(422);
		return res.json({ message: `Error in Route Data : ${error.message}`, success: false });
	} else {
		next();
	}
};

module.exports = routeValidator;