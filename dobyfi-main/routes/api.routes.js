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
  
    const req = http.request(options, function (apiRes) {
      const chunks = [];
  
      apiRes.on('data', function (chunk) {
        chunks.push(chunk);
      });
  
      apiRes.on('end', function () {
        const body = Buffer.concat(chunks);
        const data = body.toString();
        // Render the appropriate template and pass the data as a parameter
        res.render('api-data.hbs', { data });
      });
    });
  
    req.end();
  });
  