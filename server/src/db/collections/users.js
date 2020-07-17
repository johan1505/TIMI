// TODO: REMOVE THE COMMENTED OUT CODE

const { User, UserGoogle } = require('../models');
const bcrypt = require('bcryptjs');

// const createNewUser = async ({ username, email, password }) => {
// 	//Encrypt password
// 	let encryptedPassword = await bcrypt.hash(password, 10);
// 	new User({
// 		username,
// 		email,
// 		password: encryptedPassword,
// 	})
// 		.save()
// 		.then(() => {})
// 		.catch((error) => error);
// };

// const findUserByUserName = async ({ username }) =>
// 	User.findOne({ username })
// 		.then((user) => user)
// 		.catch((error) => error);

const findByGoogleId = async ({ googleId }) =>
	// console.log(googleId)
	UserGoogle.findOne({ googleId })
		.then((user) => user)
		.catch((error) => error);

const createGoogleUser = async ({ name, googleId }) => {
	return new UserGoogle({
		name,
		googleId,
	})
		.save()
		.then((user) => user)
		.catch((error) => error);
};

// const findUserById = async (id) =>
// 	User.findById(id)
// 		.then((user) => user)
// 		.catch((error) => error);

module.exports = {
	//createNewUser,
	//findUserByUserName,
	//findUserById,
	createGoogleUser,
	findByGoogleId,
};
