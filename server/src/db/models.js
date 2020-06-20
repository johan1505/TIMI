const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// // Event schema
// const eventSchema = new Schema({
// 	title: {
// 		type: String,
// 		required: true,
// 		trim: true,
// 	},

// 	startTime: {
// 		type: Date,
// 		default: Date.now,
// 		required: true,
// 	},

// 	endTime: {
// 		type: Date,
// 		default: Date.now,
// 		required: true,
// 	},
// });

// Summary schema
const summarySchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	startDate: {
		type: Date,
		default: Date.now,
		required: true,
	},
	endDate: {
		type: Date,
		default: Date.now,
		required: true,
	},
	events: [{ type: Object }],
});

// User schema
const userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		max: 155,
		min: 6,
	},
	password: {
		type: String,
		required: true,
		max: 1024,
		min: 6,
	},
});

const userGoogle = new Schema({
	name: {
		type: String,
		required: true,
	},
	googleId: {
		type: String,
		required: true,
	},
});
const Summary = mongoose.model('Summary', summarySchema);
// const Event = mongoose.model('Event', eventSchema);
const UserGoogle = mongoose.model('UserGoogle', userGoogle);
const User = mongoose.model('User', userSchema);

module.exports = { Summary, User, UserGoogle };
