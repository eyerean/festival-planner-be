const express = require('express')
const app = express()
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');

const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./config'); // get our config file
const User   = require('./models/user'); // get our mongoose model

//configuration
const port = process.env.PORT || 3030; // used to create, sign, and verify tokens

mongoose.connect(config.database, {
  useMongoClient: true
}); // connect to database

app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// use morgan to log requests to the console
app.use(morgan('dev'));

//routes
app.get('/', function (req, res) {
  res.send('Hello World!!!')
})

//start the server
app.listen(port, function () {
  console.log('Festival Planner listening on port 3030!')
})
