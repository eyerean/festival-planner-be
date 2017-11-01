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

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
  useMongoClient: true
}); // connect to database

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected to the db ja!');
});

app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// use morgan to log requests to the console
app.use(morgan('dev'));

//routes
app.get('/', function (req, res) {
  res.send('Hello World!!!')
});

app.get('/setup', function(req, res) {

  // create a sample user
  var firstUser = new User({ 
    name: 'Jane Doe', 
    password: 'doepass',
    admin: true 
  });

  // save the sample user
  firstUser.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

// API routes

// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to lgoin with a user (POST http://localhost:3030/api/login)
apiRoutes.post('/login', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.status(401).send({ success: false, message: 'Authentication failed. Username is not found.' }); 
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
        res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn : '24h' // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          user: user.name,
          token: token
        });
      }   

    }

  });
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.status(401).send({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

// route to show a random message (GET http://localhost:3030/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:3030/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

//start the server
app.listen(port, function () {
  console.log('Festival Planner listening on port 3030!')
})
