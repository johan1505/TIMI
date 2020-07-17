// TODO: DELETE THIS FILE

const { Event } = require('../models');

const findEvents = () =>
	Event.find()
		.then((events) => events)
		.catch((error) => error);

const createNewEvent = ({ title, startTime, endTime }) =>
	new Event({
		title,
		startTime: Date.parse(startTime),
		endTime: Date.parse(endTime),
	})
		.save()
		.then(() => {})
		.catch((error) => error);

const findEventById = ({ id }) => Event.findById(id).then((event) => event);

const deleteEvent = ({ id }) => Event.findByIdAndDelete(id).then(() => {});

const updateEvent = ({ id, title, startTime, endTime }) =>
	Event.findById(id)
		.then((event) => {
			event.title = title;
			event.startTime = Date.parse(startTime);
			event.endTime = Date.parse(endTime);

			event
				.save()
				.then(() => {})
				.catch((error) => error);
		})
		.catch((error) => error);

module.exports = {
	findEvents,
	findEventById,
	createNewEvent,
	deleteEvent,
	updateEvent,
};
