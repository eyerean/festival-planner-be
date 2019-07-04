const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stagesSchema = new Schema({
  label: String,
  stageOrder: Number
});

const artistsSchema = new Schema({
  label: String,
  amountOfTimeslots: Number,
  stageOrder: Number,
  stage: String,
  dayOrder: Number,
  day: String,
});

const daysSchema = new Schema({
  label: String,
  dayOrder: Number,
  stagesCols: [stagesSchema],
});

const timeslotsSchema = new Schema({
  timeslotOrder: Number,
  timeslotStart: String,
  artistsCols: [artistsSchema]
});

const festivalDetailsSchema = new Schema({
  days: [daysSchema],
  timeslots: [timeslotsSchema]
});

const festivalSchema = new Schema({
  name: String,
  startDate: String, // (ISOString)
  endDate: String, // (ISOString)
  description: String,
  status: String,
  details: festivalDetailsSchema
});

const ModelClass = mongoose.model('Festival', festivalSchema);
module.exports = ModelClass;
