const User = require('../db/models').User;
const router = require('express').Router();
const passport = require('passport');
const { google } = require('googleapis');

// authentication router
router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['https://www.googleapis.com/auth/calendar.readonly', 'profile'],
	})
);

router.get('/test', passport.authenticate('google-token'), (req, res) => {
	console.log(req);
	res.status(200).send({
		user: req.user,
		msg: 'Hello',
	});
});
// Returns user info
router.get(
	'/google/callback',
	passport.authenticate('google'),
	async (req, res) => {
		res.status(200).json(req.user);
		// console.log(`Access token from redirect URL: ${req.user}`);
		// const oAuthClient = new google.auth.OAuth2(
		// 	process.env.GOOGLE_CLIENT_ID,
		// 	process.env.GOOGLE_CLIENT_SECRET,
		// 	'http://localhost:5000/auth/google/callback'
		// );
		// oAuthClient.setCredentials({
		// 	access_token: req.user,
		// });

		// const calendar = google.calendar({
		// 	version: 'v3',
		// 	auth: oAuthClient,
		// });

		// try {
		// 	const response = await calendar.events.list({
		// 		calendarId: 'primary',
		// 		timeMin: new Date().toISOString(),
		// 		maxResults: 10,
		// 		singleEvents: true,
		// 		orderBy: 'startTime',
		// 	});

		// 	const summaryEvents = response.data.items.map((event, i) => {
		// 		return {
		// 			start: event.start.dateTime || event.start.date,
		// 			title: event.summary,
		// 		};
		// 	});
		// 	res.status(200).json(summaryEvents);
		// } catch (error) {
		// 	console.log(error);
		// 	res.status(400).json(error);
		// }
	}
);

module.exports = router;
