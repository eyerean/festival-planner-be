module.exports = app => {
  app.get('/', (req, res) => {
    res.send('Hello World!!!')
  });

  app.get('/setup', (req, res) => {
    // create a sample user
    var firstUser = new User({ 
      name: 'Jane Doe', 
      password: 'doepass',
      admin: true 
    });

    // save the sample user
    firstUser.save((err) =>{
      if (err) throw err;

      console.log('User saved successfully');
      res.json({ success: true });
    });
  });
};
