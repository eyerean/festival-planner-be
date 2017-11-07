const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../models/user');
const config = require('../config');

const tokenForUser = user => {
  return jwt.sign(user, config.secret, {
          expiresIn : '24h' // expires in 24 hours
        });
};

exports.login = (req, res) => {
  // find the user
  User.findOne({
    name: req.body.name
  }, (err, user) => {
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
        var token = tokenForUser(user);

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
};

exports.verifyToken = (req, res, next) => {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
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
};
