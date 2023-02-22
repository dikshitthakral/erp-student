const joi = require('joi');

const validation = joi.object({
    stoppageName: joi.string().trim(true).required(), 
    stopTime: joi.string().trim(true).required(), 
    routeFare: joi.number().required()
});

const stoppageValidator = async (req, res, next) => {
	const { error } = validation.validate(req.body);
	if (error) {
		res.status(422);
		return res.json({ message: `Error in Route Data : ${error.message}`, success: false });
	} else {
		next();
	}
};

module.exports = stoppageValidator;