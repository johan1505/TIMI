const router = require('express').Router();
const passport = require('passport');
const { createNewUser } = require('../db/collections/users');
const { validateRegisterUser } = require('../lib/Validation/Validators');
const { signJWT } = require('../lib/jwt/jwt');

router.post('/register', async (req, res) => {
	const validationResponse = await validateRegisterUser(req.body);
	if (!validationResponse.isValid) {
		res.status(400).send(validationResponse.errorMessage);
	} else {
		const { username, email, password } = req.body;
		try {
			await createNewUser({ username, email, password });
			res.status(200).json({ success: true });
		} catch (error) {
			res.status(400).json({ success: false });
		}
	}
});

router.post(
	'/login',
	passport.authenticate('login', { session: false }),
	async (req, res) => {
		try {
			const token = await signJWT(
				req.user.toJSON(),
				process.env.JWT_SECRET,
				{}
			);
			res.status(200).json({ jwt: token });
		} catch (e) {
			res.status(400).json(e);
		}
	}
);

module.exports = router;
