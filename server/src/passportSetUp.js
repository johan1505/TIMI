const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GoogleTokenStrategy = require('passport-google-token').Strategy;
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

// This strategy used to create/login users using Google accounts

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
			console.log(accessToken);
			try {
				const user = await findByGoogleId({ googleId: profile.id });
				if (user) {
					const returnUser = {
						...user._doc,
						accessToken,
					};
					done(null, returnUser);
				} else {
					const newUser = await createGoogleUser({
						name: profile.displayName,
						googleId,
					});
					const returnUser = {
						...newUser._doc,
						accessToken,
					};
					done(null, returnUser);
				}
			} catch (error) {
				done(null, false);
			}
		}
	)
);

// This strategy used to authenticate endpoints using access token provided by google
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
