const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const Authentication = require('./controllers/authentication');
const User = require('./models/user'); // get our mongoose model

module.exports = (api, app) => {
  // route to login with a user (POST http://localhost:3030/api/login)
  api.post('/login', Authentication.login);

  // route middleware to verify a token
  api.use((req, res, next) => {
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
  api.get('/', (req, res) => {
    res.json({ message: 'Welcome to the coolest API on earth!' });
  });


  // route to return all users (GET http://localhost:3030/api/users)
  api.get('/users', (req, res) => {
    User.find({}, (err, users) => {
      res.json(users);
    });
  });

  // apply the routes to our application with the prefix /api
  app.use('/api', api);
};
