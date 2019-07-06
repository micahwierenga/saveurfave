const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes/routes.js');

// Initialize body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set the static files directory
app.use('/', express.static(path.join(__dirname, 'public')));

// Set response headers to allow all methods
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization", "Access-Control-Allow-Origin");
  next();
});

// Load the routes
app.use(router);

// Initialize server
app.listen(process.env.PORT || 3000, function(){
  console.log("Listening on port 3000");
});
