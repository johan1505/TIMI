const passport = require('passport');
//const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const { google } = require('googleapis');
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const JWTStrategy = require('passport-jwt').Strategy;
const { findUserByUserName, findUserById } = require('./db/collections/users');
const { verifyPassword } = require('./lib/Validation/Validators');
require('dotenv').config();

passport.use(
	'login',
	new LocalStrategy(async (username, password, done) => {
		try {
			// Check if username exists
			const user = await findUserByUserName({ username });
			if (!user) {
				return done(null, false);
			}

			// Check if passwords match
			const isPasswordValid = await verifyPassword(password, user.password);
			if (!isPasswordValid) {
				return done(null, false);
			}

			return done(null, user);
		} catch (e) {
			return done(e);
		}
	})
);

passport.use(
	'jwt',
	new JWTStrategy(
		{
			secretOrKey: process.env.JWT_SECRET,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		},
		async (jwtPayload, done) => {
			try {
				const user = await findUserById(jwtPayload._id);
				if (!user) {
					return done(null, false);
				}
				return done(null, user);
			} catch (e) {
				return done(e);
			}
		}
	)
);
// // Helper Passport functions

// // Serialize user by grabbing the id from the user object
// passport.serializeUser((user, done) => {
// 	done(null, user.id);
// });

// // Deserialize user id by grabbing the corresponding user from the db
// passport.deserializeUser((id, done) => {
// 	User.findById(id)
// 		.then((user) => {
// 			done(null, user);
// 		})
// 		.catch((error) => {
// 			console.log('Error deserializing user:' + error);
// 		});
// });

// // Sets up passport
// passport.use(
// 	new GoogleStrategy(
// 		{
// 			clientID: process.env.GOOGLE_CLIENT_ID,
// 			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// 			callbackURL: 'http://localhost:5000/auth/google/callback',
// 		},
// 		(accessToken, refreshToken, profile, done) => {
// 			console.log('ACCESS TOKEN: ' + accessToken);

// 			const oAuthClient = new google.auth.OAuth2(
// 				process.env.GOOGLE_CLIENT_ID,
// 				process.env.GOOGLE_CLIENT_SECRET,
// 				'http://localhost:5000/auth/google/callback'
// 			);
// 			oAuthClient.setCredentials({
// 				access_token: accessToken,
// 			});

// 			console.log(oAuthClient);

// 			const calendar = google.calendar({
// 				version: 'v3',
// 				auth: oAuthClient,
// 			});

// 			calendar.events.list(
// 				{
// 					calendarId: 'primary',
// 					timeMin: new Date().toISOString(),
// 					maxResults: 10,
// 					singleEvents: true,
// 					orderBy: 'startTime',
// 				},
// 				(err, res) => {
// 					if (err) {
// 						console.log(err);
// 						return;
// 					}
// 					const events = res.data.items;
// 					if (events.length) {
// 						console.log('Upcoming 10 events:');
// 						events.map((event, i) => {
// 							const start = event.start.dateTime || event.start.date;
// 							console.log(`${start} - ${event.summary}`);
// 						});
// 					} else {
// 						console.log('No upcoming events found.');
// 					}
// 				}
// 			);

// 			console.log('Profile: ');
// 			console.log(profile);

// 			User.findOne({ googleId: profile.id }).then((currentUser) => {
// 				if (currentUser) {
// 					console.log('USER FOUND: ' + currentUser);
// 					done(null, currentUser);
// 				} else {
// 					new User({
// 						name: profile.displayName,
// 						googleId: profile.id,
// 						thumbnail: profile.photos[0].value,
// 					})
// 						.save()
// 						.then((newUser) => {
// 							console.log('NEW USER: ' + newUser);
// 							done(null, newUser);
// 						});
// 				}
// 			});
// 		}
// 	)
// );
