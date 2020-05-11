const router = require('express').Router();
const {
	findEvents,
	createNewEvent,
	findEventById,
	deleteEvent,
	updateEvent,
} = require('../db/collections/events');

router.route('/').get(async (req, res) => {
	try {
		const events = await findEvents();
		res.status(200).json(events);
	} catch (error) {
		res.status(400).json(error);
	}
});

router.route('/add').post(async (req, res) => {
	const { title, startTime, endTime } = req.body;
	try {
		await createNewEvent({ title, startTime, endTime });
		res.status(200).json('Event added!');
	} catch (error) {
		res.status(400).json(error);
	}
});

router.route('/:id').get(async (req, res) => {
	const { id } = req.params;
	try {
		const event = await findEventById({ id });
		res.status(200).json(event);
	} catch (error) {
		res.status(400).json(error);
	}
});

router.route('/:id').delete(async (req, res) => {
	const { id } = req.params;
	try {
		await deleteEvent({ id });
		res.status(200).json('Event deleted');
	} catch (error) {
		res.status(400).json(error);
	}
});

router.route('/update').post(async (req, res) => {
	const { id, title, startTime, endTime } = req.body;
	try {
		await updateEvent({ id, title, startTime, endTime });
		res.status(200).json('Event updated!');
	} catch (error) {
		res.status(400).json(error);
	}
});

module.exports = router;
