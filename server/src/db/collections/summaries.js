const { Summary } = require('../models');

const findSummaries = ({ userId }) =>
	Summary.find({ user: userId })
		.then((summaries) => summaries)
		.catch((error) => error);

const createNewSummary = ({ userId, startDate, endDate, events }) =>
	new Summary({
		user: userId,
		startDate: Date.parse(startDate),
		endDate: Date.parse(endDate),
		events,
	})
		.save()
		.then(() => {})
		.catch((error) => error);

const findSummariesById = ({ id }) =>
	Summary.findById(id).then((summary) => summary);

const deleteSummary = (id) => Summary.findByIdAndDelete(id).then(() => {});

const updateSummary = (id, startDate, endDate, events) => {
	Summary.findById(id)
		.then((summary) => {
			summary.startDate = Date.parse(startDate);
			summary.endDate = Date.parse(endDate);
			summary.events = events;
			summary
				.save()
				.then(() => {})
				.catch((error) => error);
		})
		.catch((error) => error);
};

module.exports = {
	findSummaries,
	findSummariesById,
	createNewSummary,
	deleteSummary,
	updateSummary,
};
