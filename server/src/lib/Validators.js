// Write a function to validate user information
// If user information is valid, then create the new user.
const Joi = require('@hapi/joi');
const { User } = require('../db/models');

const registerSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required().email(),
	password: Joi.string().min(6).required(),
});

const validateRegisterUser = async (userInformation) => {
	const validationResponse = {
		isValid: true,
		errorMessage: '',
	};

	const { error } = registerSchema.validate(userInformation);

	if (error) {
		validationResponse.isValid = false;
		validationResponse.errorMessage = error.details[0].message;
	}

	const emailExists = await User.findOne({ email: userInformation.email });
	
	if (emailExists) {
		validationResponse.isValid = false;
		validationResponse.errorMessage = 'Email has already been used';
	}

	return validationResponse;
};

module.exports = {
	validateRegisterUser,
};
