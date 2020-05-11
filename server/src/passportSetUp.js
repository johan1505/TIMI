const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./db/models').User;
const { google } = require('googleapis');

require('dotenv').config();

// Helper Passport functions

// Serialize user by grabbing the id from the user object
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// Deserialize user id by grabbing the corresponding user from the db
passport.deserializeUser((id, done) => {
	User.findById(id)
		.then((user) => {
			done(null, user);
		})
		.catch((error) => {
			console.log('Error deserializing user:' + error);
		});
});

// Sets up passport
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:5000/auth/google/callback',
		},
		(accessToken, refreshToken, profile, done) => {
			console.log('ACCESS TOKEN: ' + accessToken);

			const oAuthClient = new google.auth.OAuth2(
				process.env.GOOGLE_CLIENT_ID,
				process.env.GOOGLE_CLIENT_SECRET,
				'http://localhost:5000/auth/google/callback'
			);
			oAuthClient.setCredentials({
				access_token: accessToken,
			});

			console.log(oAuthClient);

			const calendar = google.calendar({
				version: 'v3',
				auth: oAuthClient,
			});

			calendar.events.list(
				{
					calendarId: 'primary',
					timeMin: new Date().toISOString(),
					maxResults: 10,
					singleEvents: true,
					orderBy: 'startTime',
				},
				(err, res) => {
					if (err) {
						console.log(err);
						return;
					}
					const events = res.data.items;
					if (events.length) {
						console.log('Upcoming 10 events:');
						events.map((event, i) => {
							const start = event.start.dateTime || event.start.date;
							console.log(`${start} - ${event.summary}`);
						});
					} else {
						console.log('No upcoming events found.');
					}
				}
			);

			console.log('Profile: ');
			console.log(profile);

			User.findOne({ googleId: profile.id }).then((currentUser) => {
				if (currentUser) {
					console.log('USER FOUND: ' + currentUser);
					done(null, currentUser);
				} else {
					new User({
						name: profile.displayName,
						googleId: profile.id,
						thumbnail: profile.photos[0].value,
					})
						.save()
						.then((newUser) => {
							console.log('NEW USER: ' + newUser);
							done(null, newUser);
						});
				}
			});
		}
	)
);
