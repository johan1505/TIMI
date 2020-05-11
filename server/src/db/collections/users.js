const { User } = require('../models');

const createNewUser = ({ name, email, password, date }) =>
	new User({
		name,
		email,
		password,
		date: Date.parse(date),
	})
		.save()
		.then(() => {})
        .catch((error) => error);
        
module.exports = {
	createNewUser,
};
