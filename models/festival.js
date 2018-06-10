const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const festivalSchema = new Schema({
  festivalName: String,
  startDate: String, // (ISOString?)
  endDate: String, // (ISOString?)
  description: String,
  status: String
});

const ModelClass = mongoose.model('Festival', festivalSchema);
module.exports = ModelClass;
