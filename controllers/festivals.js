const Festival = require('../models/festival');

exports.create = (req, res, next) => {
  const name = req.body.name;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const status = req.body.status;
  const desc = req.body.desc;
  const detailsDefault = {
    days: [],
    timeslots: []
  };
  
  const detailsMock = {
    days: [{
      label: 'Saturday',
      dayOrder: 1,
      stagesCols: [{
          label: 'main stage',
          stageOrder: 1,
        },
        {
          label: 'stage abc',
          stageOrder: 2,
        },
      ],
    }],
    timeslots: [
      {
        timeslotOrder: 0,
        timeslotStart: '15:00',
        artistsCols: [
          {
            label: 'band A',
            amountOfTimeslots: 1,
            stageOrder: 1,
            stage: 'main stage',
            dayOrder: 1,
            day: 'saturday',
          },
          {
            label: '-',
            amountOfTimeslots: 1,
            stageOrder: 2,
            stage: 'stage abc',
            dayOrder: 1,
            day: 'saturday',
          },
        ],
      },
      {
        timeslotOrder: 1,
        timeslotStart: '16:00',
        artistsCols: [
          {
            label: 'band ZZ',
            amountOfTimeslots: 2,
            stageOrder: 1,
            stage: 'main stage',
            dayOrder: 1,
            day: 'saturday',
          },
          {
            label: 'famous band',
            amountOfTimeslots: 1,
            stageOrder: 2,
            stage: 'stage abc',
            dayOrder: 1,
            day: 'saturday',
          },
        ],
      },
    ]
  }

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
      startDate: startDate,
      endDate: endDate,
      description: desc,
      status: status,
      details: detailsMock //{} // on create this is empty
    });

    festival.save(err => {
      if(err) throw err;
      res.json({success: 'Festival created successfully!' });
    });
  });
};


