var mongoose = require('../configs/database');
var Schema = mongoose.Schema;

var shouldBuySchema = new Schema({
  name: String,
  date: Date,
  close: Number
});

shouldBuySchema.index({
  date: -1,
  name: 1
});

module.exports = mongoose.model('shouldbuys', shouldBuySchema);
