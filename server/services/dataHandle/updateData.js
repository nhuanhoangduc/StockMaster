/*
 * @author: Hoang Duc Nhuan
 * Update stock data to database
 */


/* init modules */
var async = require('async');
var asyncConfig = require('../../configs/async');
var stockDB = require('./stockDB');
var downloader = require('./downloadData');

/*
 * Update a stock data between two dates
 * @param {string} stockname
 * @param {string} fromDate format date : yyyy-mm-dd
 * @param {string} toDate format date : yyyy-mm-dd
 * @param {function} callback(err)
 */
var betweenTwoDates = function(stockName, fromDate, toDate, callback) {
  var stockName = stockName.toUpperCase();

  var fromDate = new Date(fromDate);
  var fromDataParse = fromDate.getDate() + '/' + (fromDate.getMonth() + 1) + '/' + fromDate.getFullYear();

  var toDate = new Date(toDate);
  var toDateParse = toDate.getDate() + '/' + (toDate.getMonth() + 1) + '/' + toDate.getFullYear();

  async.waterfall([
      // download data from internet
      function(next) {
        downloader.downloadStockData(stockName, fromDataParse, toDateParse, function(err, stockData) {
          next(err, stockData);
        });
      },

      // write stock's data to database
      function(stockData, next) {
        var records = stockData.split('\n');
        records.splice(0, 1);

        if (records.length === 0)
          return next(null);

        // recognize each stock record  and write to database
        async.eachLimit(records, asyncConfig.eachLimit, function(record, nextRecord) {
            if (!record)
              return nextRecord();

            var dateData = record.split(',')[0].split('/');
            var date = new Date(dateData[2] + '-' + dateData[1] + '-' + dateData[0]);

            var stockRecord = {
              name: stockName.toUpperCase(),
              date: date,
              close: record.split(',')[1]
            };

            stockDB.writeStockRecord(stockRecord, function(err) {
              nextRecord();
            });
          },
          // finish loop
          function() {
            next(null);
          });
      }
    ],
    // finish writi..ng
    function(err) {
      return callback(err);
    });
};

/*
 * Update list of stocks
 * @param {string array} listStocks
 * @param {string} fromDate format date : yyyy-mm-dd
 * @param {string} toDate format date : yyyy-mm-dd
 * @param {function} callback(listStockFail, time)
 */
var listOfStocks = function(listStocks, fromDate, toDate, callback) {
  var listStockFail = [];
  var startTime = new Date();
  var endTime;

  // update list
  async.eachLimit(listStocks, asyncConfig.internetLimit, function(stockName, nextItem) {
      //update each stock
      async.waterfall([
        // remove stock data between fromDate and toDate
        function(next) {
          stockDB.removeStockBetweenDates(stockName.toUpperCase(), fromDate, toDate, function(err) {
            next(err);
          })
        },

        // update data
        function(next) {
          betweenTwoDates(stockName, fromDate, toDate, function(err) {
            next(err);
          });
        }
      ], function(err) {
        if (err) { // if err push stock to listStockFail
          listStockFail.push(stockName);
          console.log('-------- ' + stockName + ' update fail!');
        } else {
          console.log(stockName + ' update successfully');
        }

        // announce this work has been completed
        nextItem();
      });
    },
    // finish update
    function() {
      console.log('Finish update');

      endTime = new Date();
      callback(listStockFail, endTime - startTime);
    });
};


/* exports all function */
module.exports = {
  betweenTwoDates: betweenTwoDates,
  listOfStocks: listOfStocks
};
