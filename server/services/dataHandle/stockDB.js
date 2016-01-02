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
 * Get data of a stock from database ulti date with time period
 * @param {string} stockName
 * @param {string} date format date : yyyy-mm-dd
 * @param {Number} timePeriod
 * @param {function} callback(err, stockRecords)
 */
var getStockUtilDate = function(stockName, date, timePeriod, callback) {
  Stock.find({
    name: stockName,
    date: {
      $lte: date
    }
  }).sort({
    date: -1
  }).limit(timePeriod).exec(function(err, records) {
    if (records.length === 0) {
      callback('records null');
    } else {
      callback(err, records);
    }
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
  getStockUtilDate: getStockUtilDate,
  removeStockBetweenDates: removeStockBetweenDates,
  removeStock: removeStock
};
