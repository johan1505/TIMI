// TODO: DELETE COMMENTED OUT CODE

// Import of packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passportSetUp = require('./passportSetUp');
const passport = require('passport');
const morgan = require('morgan');
require('dotenv').config();

// Imports routers
// const eventRouter = require('./routes/events');
const summaryRouter = require('./routes/summaries');
const authRouter = require('./routes/auth');
// const usersRouter = require('./routes/users');

// Set up app
const app = express();
app.use(cors());
app.use(morgan('dev'));
//initialize passport
app.use(passport.initialize());
app.use(express.json());

const port = process.env.PORT || 5000;

// Mongo db connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});

// Routes
// app.use('/events', eventRouter);
app.use('/summaries', summaryRouter);
app.use('/auth', authRouter);
// app.use('/users', usersRouter);

// Start server
app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
