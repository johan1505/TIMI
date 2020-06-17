// Write a function to validate user information
// If user information is valid, then create the new user.
const { User } = require('../../db/models');
const { registerSchema, loginSchema } = require('./Schemas');
const { findUserByUserName } = require('../../db/collections/users');
const bcrypt = require('bcryptjs');

// Fix. As long as any of the validation steps is not valid. Return
const validateRegisterUser = async (userInformation) => {
	// Check if user information matches the validation schema
	const { error } = registerSchema.validate(userInformation);
	if (error) {
		return {
			isValid: false,
			errorMessage: error.details[0].message,
		};
	}

	// Check if there exists an account linked to the email
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

const validateLoginUser = async (userInformation) => {
	// Check if user information matches the validation schema
	const { error } = loginSchema.validate(userInformation);
	if (error) {
		return {
			isValid: false,
			errorMessage: error.details[0].message,
		};
	}

	// Check if there exists an account linked to the email
	const { username } = userInformation;
	const user = await findUserByUserName({ username });
	if (!user) {
		return {
			isValid: false,
			errorMessage: 'User does not exist',
		};
	}

	console.log(userInformation, user);
	// Check password is correct
	const validPassword = await bcrypt.compare(
		userInformation.password,
		user.password
	);

	console.log('vd', validPassword);
	if (!validPassword) {
		return {
			isValid: false,
			errorMessage: 'Invalid password',
		};
	}

	return {
		isValid: true,
		errorMessage: '',
	};
};

module.exports = {
	validateRegisterUser,
	validateLoginUser,
};
