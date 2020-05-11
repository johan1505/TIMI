const router = require('express').Router();
const { createNewUser } = require('../db/collections/users');
router.post('/register', async (req, res) => {
	const { name, email, password, date } = req.body;
	try {
		await createNewUser({ name, email, password, date });
		res.status(200).json('User successfully created');
	} catch (error) {
		res.status(400).json('Some error occurred. User was not created');
	}
});

module.exports = router;
