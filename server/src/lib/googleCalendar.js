const { google } = require('googleapis');

const getCalendar = (access_token) => {
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
};

// TO DO:  Get google calendar events from startDate to endDate
const getEvents = async (startDate, endDate, access_token) => {
	const calendar = getCalendar(access_token);

	const response = await calendar.events.list({
		calendarId: 'primary',
		timeMin: new Date().toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: 'startTime',
	});

    // TO DO: Calculate the duration time by subtracting start time and end time
	const events = response.data.items.map((event, i) => {
		return {
			start: event.start.dateTime || event.start.date,
			title: event.summary,
		};
	});

	return events;
};

module.exports = {
	getEvents,
};
