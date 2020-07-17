const router = require('express').Router();
const passport = require('passport');
const {
	findSummaries,
	createNewSummary,
	findSummariesById,
	deleteSummary,
	updateSummary,
} = require('../db/collections/summaries');
const { isOwner } = require('../lib/Validation/Validators');
const { getEvents } = require('../lib/googleCalendar');

router.get('/', passport.authenticate('google-token'), async (req, res) => {
	console.log(req.user);
	try {
		const userId = req.user._id;
		const summaries = await findSummaries({ userId });
		res.status(200).send({ success: true, summaries });
	} catch (error) {
		console.log(error);
		res.status(400).send({
			success: false,
			message: 'Some error occurred, please try again',
		});
	}
});

// Adds a new summary
router.post('/add', passport.authenticate('google-token'), async (req, res) => {
	try {
		const { startDate, endDate } = req.body;
		const events = await getEvents(
			startDate,
			endDate,
			req.headers.access_token
		);
		
		await createNewSummary({
			userId: req.user._id,
			startDate,
			endDate,
			events,
		});
		res
			.status(200)
			.send({ success: true, message: 'Summary successfully created' });
	} catch (error) {
		console.log(error);
		res.status(400).send({
			success: false,
			message: 'Some error occurred, please try again',
		});
	}
});

// Finds a specific summary
router.get('/:id', passport.authenticate('google-token'), async (req, res) => {
	try {
		const { id } = req.params;
		const summary = await findSummariesById({ id });
		if (isOwner(req.user._id, summary)) {
			res.status(200).send({ success: true, summary });
		} else {
			res.status(400).send({
				success: false,
				message: 'User is not owner of the summary',
			});
		}
	} catch (error) {
		console.log(error);
		res.status(400).send({
			success: false,
			message: 'Some error occurred, please try again',
		});
	}
});

// Deletes a specific summary
router.post(
	'/delete',
	passport.authenticate('google-token'),
	async (req, res) => {
		try {
			const { summary } = req.body;
			if (isOwner(req.user._id, summary)) {
				await deleteSummary(summary._id);
				res.status(200).send({ success: true, message: 'Summary deleted!' });
			} else {
				res.status(400).send({
					success: false,
					message: 'User is not owner of the summary',
				});
			}
		} catch (error) {
			console.log(error);
			res.status(400).send({
				success: false,
				message: 'Some error occurred, please try again',
			});
		}
	}
);

router.post(
	'/update',
	passport.authenticate('google-token'),
	async (req, res) => {
		const { summary } = req.body;
		try {
			if (isOwner(req.user._id, summary)) {
				await updateSummary(
					summary._id,
					summary.startDate,
					summary.endDate,
					summary.events
				);
				res.status(200).send({ success: true, message: 'Summary updated' });
			} else {
				res.status(400).send({
					success: false,
					message: 'User is not owner of the summary',
				});
			}
		} catch (error) {
			console.log(error);
			res.status(400).send({
				success: false,
				message: 'Some error occurred, please try again',
			});
		}
	}
);

module.exports = router;
