const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const festivalSchema = new Schema({
  name: String,
  fromDate: String, // (ISOString)
  toDate: String, // (ISOString)
  description: String,
  status: String
});

const ModelClass = mongoose.model('Festival', festivalSchema);
module.exports = ModelClass;
