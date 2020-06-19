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

router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const userId = req.user._id;
			const summaries = await findSummaries({ userId });
			res.status(200).json({ success: true, summaries });
		} catch (error) {
			console.log(error);
			res.status(400).json({
				success: false,
				message: 'Some error occurred, please try again',
			});
		}
	}
);
// Adds a new summary
router.post(
	'/add',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const userId = req.user._id;
		const { startDate, endDate, events } = req.body;
		try {
			await createNewSummary({ userId, startDate, endDate, events });
			res
				.status(200)
				.json({ success: true, message: 'Summary successfully created' });
		} catch (error) {
			console.log(error);
			res.status(400).json({
				success: false,
				message: 'Some error occurred, please try again',
			});
		}
	}
);

// Finds a specific summary
router.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { id } = req.params;
		try {
			const userId = req.user._id;
			const summary = await findSummariesById({ id });
			if (isOwner(userId, summary)) {
				res.status(200).json({ success: true, summary });
			} else {
				res.status(400).json({
					success: false,
					message: 'User is not owner of the summary',
				});
			}
		} catch (error) {
			console.log(error);
			res.status(400).json({
				success: false,
				message: 'Some error occurred, please try again',
			});
		}
	}
);

// Deletes a specific summary
router.post(
	'/delete',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const userId = req.user._id;
			const { summary } = req.body;
			if (isOwner(userId, summary)) {
				await deleteSummary(summary._id);
				res.status(200).json({ success: true, message: 'Summary deleted!' });
			} else {
				res.status(400).json({
					success: false,
					message: 'User is not owner of the summary',
				});
			}
		} catch (error) {
			console.log(error);
			res.status(400).json({
				success: false,
				message: 'Some error occurred, please try again',
			});
		}
	}
);

router.post(
	'/update',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const userId = req.user._id;
		const { summary } = req.body;
		try {
			if (isOwner(userId, summary)) {
				await updateSummary(
					summary._id,
					summary.startDate,
					summary.endDate,
					summary.events
				);
				res.status(200).json({ success: true, message: 'Summary updated' });
			} else {
				res.status(400).json({
					success: false,
					message: 'User is not owner of the summary',
				});
			}
		} catch (error) {
			console.log(error);
			res.status(400).json({
				success: false,
				message: 'Some error occurred, please try again',
			});
		}
	}
);

module.exports = router;
