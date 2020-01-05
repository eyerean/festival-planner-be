const moment = require('moment');
const Festival = require('../models/festival');

function makeDefaultDays(startDate, endDate){
  const a = moment(endDate, 'DD-MM-YYYY');
  const b = moment(startDate, 'DD-MM-YYYY');
  const amountOfDays = a.diff(b, 'days') + 1;
  
  const days = [];
  
  for(var i=0; i<amountOfDays; i++){
    days.push({
      label: moment(startDate, 'DD-MM-YYYY').add(i, 'days').format('dddd, DD MMM'),
      dayOrder: i + 1,
      stagesCols: []
    });
  }
  
  return days;
};

function makeDefaultTimeslots(startTime, endTime, timeslot){
  const a = moment(endTime, 'HH:mm');
  const b = moment(startTime, 'HH:mm');
  const amountOfΤimeslots = a.diff(b, timeslot);
  
  const timeslots = [];
  
  for(var i=0; i<amountOfΤimeslots; i++){
    timeslots.push({
      timeslotStart: moment(startTime, 'HH:mm').add(i, 'hour').format('HH:mm'),
      timeslotOrder: i + 1,
      artistsCols: []
    });
  }
  
  return timeslots;
};

exports.create = (req, res) => {
  const name = req.body.name;
  const startDate = req.body.startDate;
  const startTime = req.body.startTime;
  const endDate = req.body.endDate;
  const endTime = req.body.endTime;
  const timeslot = req.body.timeslot;
  const status = req.body.status;
  const description = req.body.description;

  const detailsDefault = {
    days: makeDefaultDays(startDate, endDate),
    timeslots: makeDefaultTimeslots(startTime, endTime, timeslot)
  };
  
  // const detailsMock = {
  //   days: [{
  //     label: 'Saturday',
  //     dayOrder: 1,
  //     stagesCols: [{
  //         label: 'main stage',
  //         stageOrder: 1,
  //       },
  //       {
  //         label: 'stage abc',
  //         stageOrder: 2,
  //       },
  //     ],
  //   }],
  //   timeslots: [
  //     {
  //       timeslotOrder: 0,
  //       timeslotStart: '15:00',
  //       artistsCols: [
  //         {
  //           label: 'band A',
  //           amountOfTimeslots: 1,
  //           stageOrder: 1,
  //           stage: 'main stage',
  //           dayOrder: 1,
  //           day: 'saturday',
  //         },
  //         {
  //           label: '-',
  //           amountOfTimeslots: 1,
  //           stageOrder: 2,
  //           stage: 'stage abc',
  //           dayOrder: 1,
  //           day: 'saturday',
  //         },
  //       ],
  //     },
  //     {
  //       timeslotOrder: 1,
  //       timeslotStart: '16:00',
  //       artistsCols: [
  //         {
  //           label: 'band ZZ',
  //           amountOfTimeslots: 2,
  //           stageOrder: 1,
  //           stage: 'main stage',
  //           dayOrder: 1,
  //           day: 'saturday',
  //         },
  //         {
  //           label: 'famous band',
  //           amountOfTimeslots: 1,
  //           stageOrder: 2,
  //           stage: 'stage abc',
  //           dayOrder: 1,
  //           day: 'saturday',
  //         },
  //       ],
  //     },
  //   ]
  // }

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
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      timeslot: timeslot,
      description: description,
      status: status,
      details: detailsDefault
    });

    festival.save(err => {
      if(err) throw err;
      res.json({success: 'Festival created successfully!' });
    });
  });
};

exports.update = (req, res) => {
  Festival.findById(req.params.id, (err, foundFest) => {
    if(err) throw err;
    if(!foundFest) {
      return res.status(404).send({
        error: `Festival with id ${festiId} not found.`,
      })
    }

    if(req.body.name){
      foundFest.name = req.body.name;
    }
    if(req.body.startDate){
      foundFest.startDate = req.body.startDate;
    }
    if(req.body.startTime){
      foundFest.startTime = req.body.startTime;
    }
    if(req.body.endDate){
      foundFest.endDate = req.body.endDate;
    }
    if(req.body.endTime){
      foundFest.endTime = req.body.endTime;
    }
    if(req.body.timeslot){
      foundFest.timeslot = req.body.timeslot;
    }
    if(req.body.status){
      foundFest.status = req.body.status;
    }
    if(req.body.description){
      foundFest.description = req.body.description;
    }
    if(req.body.details){
      foundFest.details = req.body.details;
    }

    foundFest.save((err, updatedFest) => {
      if(err) throw err;
      res.json({ success: 'Festival updated successfuly!', festival: updatedFest });
    });
  });
};

