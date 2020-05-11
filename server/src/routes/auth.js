const User = require('../db/models').User;
const router = require('express').Router();
const passport = require('passport');

router.post('/register', (req, res) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	});

	user
		.save()
		.then((savedUser) => {
			console.log('saved');
			res.json(savedUser);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).send(error);
		});
});
// authentication router
// router.get('/google',
//   passport.authenticate('google', {
//     scope: ['https://www.googleapis.com/auth/calendar.readonly', 'profile']
// }));

// authentication redirect router

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//     });

// Returns user info
// router.get('/google/callback',
//     passport.authenticate('google'),
//     (req, res) => {
//         res.json(req.user);
//     });

// router.get('/logout', (req, res) => {
//     req.logout();
//     res.redirect('/');
// });

module.exports = router;
