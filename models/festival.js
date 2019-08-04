const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stageSchema = new Schema({
  label: String,
  stageOrder: Number
});

const artistSchema = new Schema({
  label: String,
  amountOfTimeslots: Number,
  stageOrder: Number,
  stage: String,
  dayOrder: Number,
  day: String,
});

const daySchema = new Schema({
  label: String,
  dayOrder: Number,
  stagesCols: [stageSchema],
});

const timeslotSchema = new Schema({
  timeslotOrder: Number,
  timeslotStart: String,
  artistsCols: [artistSchema]
});

const festivalDetailsSchema = new Schema({
  days: [daySchema], 
  timeslots: [timeslotSchema]
});

const festivalSchema = new Schema({
  name: String,
  startDate: String,
  startTime: String,
  endDate: String,
  endTime: String,
  description: String,
  status: String,
  details: festivalDetailsSchema
});

const FestivalModel = mongoose.model('Festival', festivalSchema);
module.exports = FestivalModel;
