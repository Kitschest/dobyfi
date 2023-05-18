const express = require('express');
const http = require('https');
const app = express();
const port = 3000;

app.set('view engine', 'hbs');

// Define a route to handle the API request and render the .hbs file
app.get('/', (req, res) => {
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

  const req = http.request(options, function (apiRes) {
    const chunks = [];

    apiRes.on('data', function (chunk) {
      chunks.push(chunk);
    });

    apiRes.on('end', function () {
      const body = Buffer.concat(chunks);
      const apiData = JSON.parse(body.toString());

      // Render the .hbs file and pass the API data as a variable
      res.render('index', { apiData });
    });
  });

  req.on('error', function (error) {
    console.error('Error making API request:', error);
    // Handle the error here
  });

  req.end();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
