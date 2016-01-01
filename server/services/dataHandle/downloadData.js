/*
 * @author: Hoang Duc Nhuan
 * Download stock's data from https://www.vndirect.com.vn
 */


/* init modules */
var request = require('request');


/*
 * Download all data of a stock from https://www.vndirect.com.vn and write to txt file
 * @param {string} stockname
 * @param {string} fromDate format date : dd/mm/yyyy
 * @param {string} toDate format date : dd/mm/yyyy
 * @param {function} callback(err, stockData)
 */
var downloadStockData = function(stockName, fromDate, toDate, callback) {
  request.post({
    url: 'https://www.vndirect.com.vn/portal/ajax/listed/DownloadReportForSymbol.shtml',
    form: {
      'model.downloadType': '$HP_DL_TYPE$',
      'pagingInfo.indexPage': '1',
      'searchMarketStatisticsView.symbol': stockName.toLowerCase(),
      'strFromDate': fromDate,
      'strToDate': toDate,
    }
  }, function(err, httpResponse, stockData) {
    if (err)
      return callback(err);

    callback(null, stockData);
  });
};


/* exports all function */
module.exports = {
  downloadStockData: downloadStockData
};
