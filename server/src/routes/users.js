const router = require('express').Router();
const passport = require('passport');
const { createNewUser } = require('../db/collections/users');
const {
	validateRegisterUser,
	// validateLoginUser,
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
			res.status(200).send('User successfully created');
		} catch (error) {
			res.status(400).send('Some error occurred. User was not created');
		}
	}
});

router.post(
	'/login',
	passport.authenticate('login', { session: false }),
	async (req, res) => {
		try {
			res.status(200).send(req.user);
		} catch (e) {
			res.status(400).send(e);
		}
	}
);

module.exports = router;
