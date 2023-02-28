const joi = require('joi');

const validation = joi.object({
    route: joi.string().required(), 
    stoppage: joi.string().required(), 
    vehicle: joi.string().required(), 
});

const vehicleRouteValidator = async (req, res, next) => {
	const { error } = validation.validate(req.body);
	if (error) {
		res.status(422);
		return res.json({ message: `Error in Vehicle Route Data : ${error.message}`, success: false });
	} else {
		next();
	}
};

module.exports = vehicleRouteValidator;