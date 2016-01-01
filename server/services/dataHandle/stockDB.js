/*
 * @author: Hoang Duc Nhuan
 * Working with database
 */


/* init modules */
var Stock = require('../../models/stock');


/*
 * Write a stock's record to database
 * @param {object} stockRecord stock model
 * @param {function} callback(err, stockRecord)
 */
var writeStockRecord = function(stockRecord, callback) {
  Stock.create(stockRecord, function(err, stockRecord) {
    if (err)
      return callback(err);

    callback(null, stockRecord);
  });
};

/*
 * Delete all data of a stock from database between two dates
 * @param {string} stockName
 * @param {string} fromDate format date : yyyy-mm-dd
 * @param {string} toDate format date : yyyy-mm-dd
 * @param {function} callback(err)
 */
var removeStockBetweenDates = function(stockName, fromDate, toDate, callback) {
  Stock.remove({
    name: stockName,
    date: {
      $lte: toDate,
      $gte: fromDate
    }
  }).exec(function(err) {
    callback(err);
  });
};

/*
 * Delete all data of a stock from database
 * @param {string} stockName
 * @param {function} callback(err)
 */
var removeStock = function(stockName, callback) {
  Stock.remove({
    name: stockName
  }).exec(function(err) {
    callback(err);
  });
};


/* exports all function */
module.exports = {
  writeStockRecord: writeStockRecord,
  removeStockBetweenDates: removeStockBetweenDates,
  removeStock: removeStock
};
