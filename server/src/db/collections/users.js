const { User } = require('../models');
const bcrypt = require('bcryptjs');

const createNewUser = async ({ username, email, password }) => {
	//Encrypt password
	let encryptedPassword = await bcrypt.hash(password, 10);
	new User({
		username,
		email,
		password: encryptedPassword,
	})
		.save()
		.then(() => {})
		.catch((error) => error);
};

const findUserByUserName = async ({ username }) =>
	User.findOne({ username })
		.then((user) => user)
		.catch((error) => error);

module.exports = {
	createNewUser,
	findUserByUserName,
};
