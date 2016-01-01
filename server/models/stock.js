var mongoose = require('../configs/database');
var Schema = mongoose.Schema;

var stockSchema = new Schema({
  name: String,
  date: Date,
  close: Number
});

stockSchema.index({
  name: 1,
  date: -1
});

module.exports = mongoose.model('stocks', stockSchema);
