/*
 * @author: Hoang Duc Nhuan
 * Forecast should buy or sell stocks
 */


/* init underscore */
var _ = require('underscore');
var async = require('async');
var asyncConfig = require('../configs/async');
var stockDB = require('./dataHandle/stockDB');
var calculator = require('./calculator');


/*
 * calculator sma data of a stock
 * @param {Array} stockRecords
 * @return {Object} smaData
 */
var smaDataCalculate = function(stockRecords) {
  var closeValueList = [];
  var smaData = {};

  _.each(stockRecords, function(record) {
    closeValueList.push(record.close);
  });

  smaData['sma10'] = calculator.sma(closeValueList, 10);
  smaData['preSma10'] = calculator.sma(closeValueList.slice(1), 10);

  smaData['sma20'] = calculator.sma(closeValueList, 20);
  smaData['preSma20'] = calculator.sma(closeValueList.slice(1), 20);

  smaData['sma50'] = calculator.sma(closeValueList, 50);
  smaData['preSma50'] = calculator.sma(closeValueList.slice(1), 50);

  smaData['sma200'] = calculator.sma(closeValueList, 200);
  smaData['preSma200'] = calculator.sma(closeValueList.slice(1), 200);

  smaData['close'] = closeValueList[0];
  smaData['closeBefore1'] = closeValueList[1];
  smaData['closeBefore2'] = closeValueList[2];

  return smaData;
};

/*
 * Forecast the stock's price will increase or not
 * @param {String} stockName
 * @param {String} date format date: yyyy-mm-dd
 * @param {Function} callback(err, result)
 */
var shouldBuying = function(stockName, date, callback) {
  var result = {
    name: stockName,
    date: date,
    shouldBuy: false
  };

  async.waterfall([
      // load stock data
      function(next) {
        stockDB.getStockUtilDate(stockName.toUpperCase(), date, 201, function(err, stockRecords) {
          next(err, stockRecords);
        });
      },

      // forecast stock's price
      function(stockRecords, next) {
        var smaData = smaDataCalculate(stockRecords);
        var subSma10 = smaData['sma10'] - smaData['preSma10'];
        var subSma20 = smaData['sma20'] - smaData['preSma20'];
        var subSma50 = smaData['sma50'] - smaData['preSma50'];
        var subSma200 = smaData['sma200'] - smaData['preSma200'];
        var subClose1 = smaData['close'] - smaData['closeBefore1'];
        var subClose2 = smaData['closeBefore1'] - smaData['closeBefore2'];

        // check conditions
        if (subSma10 > 0 && subSma20 > 0 && subClose1 > 0 && subClose2 > 0 && subSma200 > 0 && subSma50 > 0) {
          if (smaData['close'] > smaData['sma20'] && smaData['close'] > smaData['sma10'] && subSma10 > subSma20) {
            if (subSma50 > subSma200 && smaData['sma50'] > smaData['sma200']) {
              result.shouldBuy = true;
            }

            if (smaData['sma20'] > smaData['sma10'] && smaData['sma20'] - smaData['sma10'] > 0.333) {
              result.shouldBuy = false;
            }
          }
        }

        next(null, result);
      }
    ],
    function(err, result) {
      callback(err, result);
    });
};

/*
 * Forecast list of stock's price will increase or not
 * @param {String} stockName
 * @param {String} date format date: yyyy-mm-dd
 * @param {Function} callback(err, listResults)
 */
var shouldBuyingList = function(listStocks, date, callback) {
  var listResults = [];

  async.eachLimit(listStocks, asyncConfig.eachLimit, function(stockName, nextItem) {
    shouldBuying(stockName, date, function(err, result) {
      if (err)
        return nextItem();

      if (result.shouldBuy) {
        listResults.push(result);
      }

      nextItem();
    });
  }, function() {
    callback(null, listResults);
  });
};


/* exports all function */
module.exports = {
  shouldBuying: shouldBuying,
  shouldBuyingList: shouldBuyingList
};
