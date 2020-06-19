// Write a function to validate user information
// If user information is valid, then create the new user.
const { User } = require('../../db/models');
const { registerSchema } = require('./Schemas');
const bcrypt = require('bcryptjs');

const validateRegisterUser = async (userInformation) => {
	// Check if user information matches the validation schema
	const { error } = registerSchema.validate(userInformation);
	if (error) {
		return {
			isValid: false,
			errorMessage: error.details[0].message,
		};
	}

	// Check if there exists an account linked to the email or username provided
	const isUserInfoValid = await User.findOne({
		$or: [
			{ email: userInformation.email },
			{ username: userInformation.username },
		],
	});

	if (isUserInfoValid) {
		return {
			isValid: false,
			errorMessage: 'Email or username have already been used',
		};
	}

	return {
		isValid: true,
		errorMessage: '',
	};
};

const isOwner = (userId, document) => {
	return userId.equals(document.user);
};

module.exports = {
	validateRegisterUser,
	verifyPassword: bcrypt.compare,
	isOwner,
};
