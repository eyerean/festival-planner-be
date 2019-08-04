const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const Authentication = require('./controllers/authentication');
const Festivals = require('./controllers/festivals');
const User = require('./models/user');
const Festival = require('./models/festival');

module.exports = (api, app) => {
  // route to login with a user (POST http://localhost:3030/api/login)
  api.post('/login', Authentication.login);
  api.post('/signup', Authentication.signup);

  // route middleware to verify a token
  api.use(Authentication.verifyToken);
  //all routes under this call will need to provide a token

  // route to show a random message (GET http://localhost:3030/api/)
  api.get('/', (req, res) => {
    res.json({ message: 'Welcome to the coolest API on earth!' });
  });

  // get all users (GET http://localhost:3030/api/users)
  api.get('/users', (req, res) => {
    User.find({}, (err, users) => {
      res.json(users);
    });
  });

  api.get('/festivals', (req, res) => {
    Festival.find({}, (err, festivals) => {
      res.json(festivals);
    });
  });

  api.get('/festivals/:id', (req, res) => {
    Festival.findById(req.params.id, (err, festival) => {
      res.json(festival);
    });
  });
  
  api.delete('/festivals/:id', (req, res) => {
    Festival.findByIdAndDelete(req.params.id, (err, festival) => {
      res.json({ message: `Successfully deleted festival "${festival.name}"`})
    });
  });

  api.post('/festivals', Festivals.create);


  // apply the routes to our application with the prefix /api
  app.use('/api', api);
};
