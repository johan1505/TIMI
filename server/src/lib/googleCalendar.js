const { google } = require('googleapis');

const getCalendar = (access_token) => {
	try {
		const oAuthClient = new google.auth.OAuth2(
			process.env.GOOGLE_CLIENT_ID,
			process.env.GOOGLE_CLIENT_SECRET,
			'http://localhost:5000/auth/google/callback'
		);
		oAuthClient.setCredentials({
			access_token,
		});

		const calendar = google.calendar({
			version: 'v3',
			auth: oAuthClient,
		});

		return calendar;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// TODO: FIGURE OUT HOW UTC WORKS
const getEvents = async (startDate, endDate, access_token) => {
	console.log(startDate, endDate);
	const calendar = getCalendar(access_token);

	const response = await calendar.events.list({
		calendarId: 'primary',
		orderBy: 'startTime',
		singleEvents: true,
		timeMin: startDate,
		timeMax: endDate,
	});

	const events = response.data.items.map((event, i) => {
		return {
			start: event.start.dateTime || event.start.date,
			end: event.end.dateTime || event.end.date,
			// Note time is in milliseconds
			time: new Date(event.end.dateTime) - new Date(event.start.dateTime),
			title: event.summary,
		};
	});
	return events;
};

module.exports = {
	getEvents,
};
