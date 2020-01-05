const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config'); // get our config file
const router = require('./router');
const apiRouter = require('./apiRouter');

// configuration
const port = process.env.PORT || 3030;

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
  useMongoClient: true
}); // connect to database

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
  console.log('connected to the db ja!');
});

app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// use morgan to log requests to the console
app.use(morgan('dev'));

// routes
router(app);

// API routes
var apiRoutes = express.Router();
apiRouter(apiRoutes, app);

// start the server
app.listen(port, () => {
  console.log('FestivalPlanner server listening on port 3030!')
});
