/*
 * @author: Hoang Duc Nhuan
 * Working with database
 */


/* init modules */
var ShouldBuy = require('../../models/shouldBuy');


/*
 * Write a should buy stock to database
 * @param {object} stockRecord stock model
 * @param {function} callback(err, rs)
 */
var write = function(result, callback) {
  ShouldBuy.create(result, function(err, result) {
    if (err)
      return callback(err);

    callback(null, result);
  });
};

/*
 * Get list of should buy stock from database by date
 * @param {string} date format date : yyyy-mm-dd
 * @param {function} callback(err, shouldBuyList)
 */
var getByDate = function(date, callback) {
  ShouldBuy.find({
    date: {
      $lte: date,
      $gte: date
    }
  }).sort({
    name: 1
  }).exec(function(err, shouldBuyList) {
    callback(err, shouldBuyList);
  });
};

/*
 * Delete list of should buy stock by date
 * @param {string} date format date : yyyy-mm-dd
 * @param {function} callback(err)
 */
var removeBetweenDates = function(date, callback) {
  ShouldBuy.remove({
    date: {
      $lte: date,
      $gte: date
    }
  }).exec(function(err) {
    callback(err);
  });
};


/* exports all function */
module.exports = {
  write: write,
  getByDate: getByDate,
  removeBetweenDates: removeBetweenDates
};
