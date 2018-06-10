const Festival = require('../models/festival');

exports.create = (req, res, next) => {
  const festivalName = req.body.festivalName;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const status = req.body.status;
  const desc = req.body.desc;

  if(!festivalName){
    return res.status(422).send({ error: 'You must provide a name for the festival'});
  }

  Festival.findOne({ festivalName: festivalName}, (err, existingFestival) => {
    if (err) throw err;
    if (existingFestival) {
      return res.status(422).send({error: 'Festival already exists'});
    }

    const festival = new Festival({
      festivalName: festivalName,
      startDate: startDate,
      endDate: endDate,
      description: desc,
      status: status
    });

    festival.save(err => {
      if(err) throw err;
      res.json({success: 'Festival created successfully!' });
    });
  });
};
