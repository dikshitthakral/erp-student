const joi = require('joi');

const validation = joi.object({
    name: joi.string().required(),
    // applicableStudent: joi.string(),
    // applicableEmployee: joi.string().when('applicableStudent', {is: joi.exist(), then: joi.optional(), otherwise: joi.required()}),
    appliableUser: joi.string().required(),
    pageLayout: joi.string().required(),
    userPhotoStyle: joi.string().required(),
    userPhotoSize: joi.string().required(),
    layoutSpacing: joi.object().keys({
        top: joi.string().required(),
        bottom: joi.string().required(),
        left: joi.string().required(),
        right: joi.string().required(),
    }),
    content: joi.string().optional()
});

const certificateValidator = async (req, res, next) => {
	const { error } = validation.validate(req.body);
	if (error) {
		res.status(422);
		return res.json({ message: `Error in Certificate Data : ${error.message}`, success: false });
	} else {
		next();
	}
};

const certificateModelValidator = async (model) => {
	const { error } = validation.validate(model);
	if (error) {
		return `Error in Certificate Data : ${error.message}`;
	} else {
		return null;
	}
};

module.exports = {
    certificateValidator,
    certificateModelValidator
}