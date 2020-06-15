const { User } = require('../models');
const bcrypt = require('bcryptjs');

const createNewUser = async ({ name, email, password }) => {
	//Encrypt password
	let encryptedPassword = await bcrypt.hash(password, 10);
	new User({
		name,
		email,
		password: encryptedPassword,
	})
		.save()
		.then(() => {})
		.catch((error) => error);
};

module.exports = {
	createNewUser,
};
