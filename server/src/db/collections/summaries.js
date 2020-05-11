const { Summary } = require('../models');

const findSummaries = () =>
	Summary.find()
		.populate('events')
		.populate('user')
		.then((summaries) => summaries)
		.catch((error) => error);

const createNewSummary = ({ user, startDate, endDate, events }) =>
	new Summary({
		user,
		startDate: Date.parse(startDate),
		endDate: Date.parse(endDate),
		events,
	})
		.save()
		.then(() => {})
		.catch((error) => error);

const findSummaryById = ({ id }) =>
	Summary.findById(id)
		.populate('events')
		.populate('user')
		.then((summary) => summary);

const deleteSummary = ({ id }) => Summary.findByIdAndDelete(id).then(() => {});

const updateSummary = ({ id, user, startDate, endDate, events }) =>
	Summary.findById(id)
		.then((summary) => {
			summary.user = user;
			summary.startDate = Date.parse(startDate);
			summary.endDate = Date.parse(endDate);
			summary.events = events;

			summary
				.save()
				.then(() => {})
				.catch((error) => error);
		})
		.catch((error) => error);

module.exports = {
	findSummaries,
	findSummaryById,
	createNewSummary,
	deleteSummary,
	updateSummary,
};
