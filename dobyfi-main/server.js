const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.get('/api-data', (req, res) => {
  const http = require('https');

  const options = {
    method: 'GET',
    hostname: 'calendarevents.p.rapidapi.com',
    port: null,
    path: '/calendar/a212edcb509733e73dca4ef55f447980c6b2b5db055aaa46bf3fda05f3c6e452@group.calendar.google.com/2',
    headers: {
      'X-RapidAPI-Key': 'YOUR_API_KEY',
      'X-RapidAPI-Host': 'calendarevents.p.rapidapi.com'
    }
  };


  req.end();
});
