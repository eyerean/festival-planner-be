const Festival = require('../models/festival');

exports.create = (req, res, next) => {
  const name = req.body.name;
  const fromDate = req.body.fromDate;
  const toDate = req.body.toDate;
  const status = req.body.status;

  if(!name){
    return res.status(422).send({ error: 'You must provide a name for the festival'});
  }

  Festival.findOne({ name: name}, (err, existingFestival) => {
    if (err) throw err;
    if (existingFestival) {
      return res.status(422).send({error: 'Festival already exists'});
    }

    const festival = new Festival({
      name: name,
      fromDate: fromDate,
      toDate: toDate,
      status: status
    });

    festival.save(err => {
      if(err) throw err;
      res.json({success: 'Festival created successfully!' });
    });
  });
};
