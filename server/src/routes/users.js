const router = require('express').Router();
const { createNewUser } = require('../db/collections/users');
const {
	validateRegisterUser,
	validateLoginUser,
} = require('../lib/Validation/Validators');

router.post('/register', async (req, res) => {
	const validationResponse = await validateRegisterUser(req.body);
	
	if (!validationResponse.isValid) {
		res.status(400).send(validationResponse.errorMessage);
	} else {
		// console.log(req.body);
		const { username, email, password } = req.body;
		try {
			// Encrypt password using bcrypt
			await createNewUser({ username, email, password });
			res.status(200).json('User successfully created');
		} catch (error) {
			res.status(400).json('Some error occurred. User was not created');
		}
	}
});

router.post('/login', async (req, res) => {
	const validationResponse = await validateLoginUser(req.body);
	if (!validationResponse.isValid) {
		res.status(400).send(validationResponse.errorMessage);
	} else {
		res.status(200).send('User logged in');
	}
});
// For the login route, use passport local strategy to authenticate a username and password. Look at c2c login route

module.exports = router;
