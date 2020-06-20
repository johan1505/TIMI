const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const { google } = require('googleapis');
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const JWTStrategy = require('passport-jwt').Strategy;
const {
	findUserByUserName,
	findUserById,
	findByGoogleId,
	createGoogleUser,
} = require('./db/collections/users');
const { verifyPassword } = require('./lib/Validation/Validators');
const { User } = require('./db/models');
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

// This passport strategy will only be used to create a summary using data from user's google calendar account

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:5000/auth/google/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			// console.log('Access token: ', accessToken);
			try {
				// console.log(profile);
				const googleId = profile.id;
				const user = await findByGoogleId({ googleId });
				// console.log(`User found: ${user}`);
				if (user) {
					const returnUser = {
						...user._doc,
						accessToken,
					};
					// console.log(returnUser);
					done(null, returnUser);
				} else {
					const name = profile.displayName;
					const newUser = await createGoogleUser({ name, googleId });
					const returnUser = {
						...newUser._doc,
						accessToken,
					};
					// console.log(returnUser);
					done(null, returnUser);
				}
			} catch (error) {
				done(null, false);
			}
		}
	)
);

passport.use(
	new GoogleTokenStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const user = await findByGoogleId({ googleId: profile.id });
				if (user) {
					done(null, user);
				}
			} catch (error) {
				done(null, false);
			}
		}
	)
);
