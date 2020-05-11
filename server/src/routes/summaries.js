const router = require('express').Router();
const passport = require('passport');
const {
	findSummaries,
	createNewSummary,
	findSummaryById,
	deleteSummary,
	updateSummary,
} = require('../db/collections/summaries');

// TO DO: Add some type of user validation
router.get('/', async (req, res) => {
	try {
		const summaries = await findSummaries();
		res.status(200).json(summaries);
	} catch (error) {
		res.status(400).json(error);
	}
});
// Adds a new summary
router.route('/add').post(async (req, res) => {
	const { user, startDate, endDate, events } = req.body;
	try {
		await createNewSummary({ user, startDate, endDate, events });
		res.status(200).json('Summary added!');
	} catch (error) {
		res.status(400).json(error);
	}
});

// Finds a specific summary and populates the events
router.route('/:id').get(async (req, res) => {
	const { id } = req.params;
	try {
		const summary = await findSummaryById({ id });
		res.status(200).json(summary);
	} catch (error) {
		res.status(400).json(error);
	}
});

// Deletes a specific summary
router.route('/:id').delete(async (req, res) => {
	const { id } = req.params;
	try {
		await deleteSummary({ id });
		res.status(200).json('Summary deleted!');
	} catch (error) {
		res.status(400).json(error);
	}
});

router.route('/update').post(async (req, res) => {
	const { id, user, startDate, endDate, events } = req.body;
	try {
		await updateSummary({ id, user, startDate, endDate, events });
		res.status(200).json('Summary updated!');
	} catch (error) {
		res.status(400).json(error);
	}
});

module.exports = router;
