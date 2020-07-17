const router = require('express').Router();
const passport = require('passport');

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['https://www.googleapis.com/auth/calendar.readonly', 'profile'],
	})
);

// Returns user info
router.get(
	'/google/callback',
	passport.authenticate('google'),
	async (req, res) => {
		res.status(200).json(req.user);
	}
);

module.exports = router;
