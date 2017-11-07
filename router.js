module.exports = app => {
  app.get('/', requireAuth, (req, res) => {
    res.send({ hi: 'there'});
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
};

