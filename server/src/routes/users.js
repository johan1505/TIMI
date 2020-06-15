const router = require('express').Router();
const { createNewUser } = require('../db/collections/users');
const { validateRegisterUser } = require('../lib/Validators');

router.post('/register', async (req, res) => {
	const validationResponse = await validateRegisterUser(req.body);
	if (!validationResponse.isValid) {
		res.status(400).send(validationResponse.errorMessage);
	} else {
		// console.log(req.body);
		const { name, email, password } = req.body;
		try {
			// Encrypt password using bcrypt
			await createNewUser({ name, email, password });
			res.status(200).json('User successfully created');
		} catch (error) {
			res.status(400).json('Some error occurred. User was not created');
		}
	}
});

// For the login route, use passport local strategy to authenticate a username and password. Look at c2c login route

module.exports = router;
