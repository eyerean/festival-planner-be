const User = require('./models/user');

module.exports = app => {
  app.get('/', (req, res) => {
    res.send('Backend server is running!')
  });

  app.get('/setup', (req, res) => {
    // create a sample user
    var firstUser = new User({ 
      name: 'Jane Doe', 
      email: 'jane.doe@example.com',
      password: 'doepass',
      admin: true 
    });

    // save the sample user
    firstUser.save((err) =>{
      if (err) throw err;
      console.log('First user saved successfully');
      res.json({ success: true });
    });
  });
};
