const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../models/user');
const config = require('../config');

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
        var token = jwt.sign(user, config.secret, {
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
};
