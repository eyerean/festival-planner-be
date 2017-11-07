const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../models/user');
const config = require('../config');

const tokenForUser = user => {
  return jwt.sign(user, config.secret, {
          expiresIn: '24h' // expires in 24 hours
        });
};

exports.login = (req, res) => {
  // find the user
  User.findOne({
    name: req.body.name
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(401).send({ success: false, message: 'Authentication failed. User is not found.' }); 
    } else if (user) {
      // check if passwords match
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) throw err;
        if(!isMatch) {
          res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.' });
        }
        const token = tokenForUser(user);
        res.json({
          success: true,
          message: 'Enjoy your token!',
          user: user.name,
          token: token
        });
      });
    }
  });
};

exports.verifyToken = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

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

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const admin = req.body.admin; //do not provide it in the form
  // probably somewhere in the admins panel, in a PUT call

  if(!email || !password){
    return res.status(422).send({ error: 'You must provide email and password'});
  }

  //see if a user with the given email exists
  User.findOne({ email: email}, (err, existingUser) => {
    if(err) throw err;
    
    //if a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({error: 'Email is already in use'});
    }

    //if a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      name: name,
      password: password,
      admin: admin
    });

    user.save(err => {
      if(err) throw err;
      //respond to request indicating the user was created
      res.json({token: tokenForUser(user) });
    });
  });
};
