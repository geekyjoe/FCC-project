// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// Trust proxy to get real IP addresses
app.set('trust proxy', true);

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// Timestamp API endpoint
app.get("/api/timestamp/:date?", function (req, res) {
  let date;
  
  if (!req.params.date) {
    // No date parameter provided, use current date
    date = new Date();
  } else {
    // Check if the parameter is a number (Unix timestamp)
    if (!isNaN(req.params.date)) {
      date = new Date(parseInt(req.params.date));
    } else {
      // Try to parse as date string
      date = new Date(req.params.date);
    }
  }
  
  // Check if date is valid
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }
  
  // Return the response in the required format
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// Request Header Parser API endpoint
app.get("/api/whoami", function (req, res) {
  // Get client IP address
  const ipaddress = req.ip || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress ||
                   (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                   req.headers['x-forwarded-for']?.split(',')[0] ||
                   req.headers['x-real-ip'] ||
                   '127.0.0.1';
  
  // Get language from Accept-Language header
  const language = req.headers['accept-language'] || '';
  
  // Get user agent (software) from User-Agent header
  const software = req.headers['user-agent'] || '';
  
  // Return the response in the required format
  res.json({
    ipaddress: ipaddress,
    language: language,
    software: software
  });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});