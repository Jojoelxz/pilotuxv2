const { google } = require('googleapis');

module.exports = async (req, res) => {
  try {
    const auth = new google.auth.JWT(
      'pilotux-650@festive-bonsai-471717-f6.iam.gserviceaccount.com',
      null,
      `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCp3HX1CftUAHd5
pRXO69ULTbW1BPYc+YtTCwUcUCBzbTKtnAN4tnwSMOnpN20fhPUgiqWGQ8kGZykn
...
-----END PRIVATE KEY-----`,
      ['https://www.googleapis.com/auth/calendar.readonly']
    );

    await auth.authorize();

    const calendar = google.calendar({ version: 'v3', auth });
    const response = await calendar.events.list({
      calendarId: 'Joeldarias23@gmail.com',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items.map(event => ({
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
    }));

    res.status(200).json(events);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'No se pudo cargar el calendario' });
  }
};
