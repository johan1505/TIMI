// TODO: DELETE THIS FILE AND ITS DIRECTORY
const jwt = require('jsonwebtoken');

const signJWT = async (target, secret, options = {}) => {
	console.log(target, secret, options);
	return new Promise((resolve, reject) => {
		jwt.sign(target, secret, options, (error, token) => {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				console.log(token);
				resolve(token);
			}
		});
	});
};

module.exports = {
	signJWT,
};
