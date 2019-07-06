const express = require('express');
const app = express();
// const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const auth = require('./auth');
const router = require('./routes/routes.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db = require('./models');
let User = db.models.User;
let FavoriteMovie = db.models.FavoriteMovie;

app.use('/', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization", "Access-Control-Allow-Origin");
  next();
});
app.use(router);

app.listen(3000, function(){
  console.log("Listening on port 3000");
});
