/*
 * @author: Hoang Duc Nhuan
 * Automatic update data
 */


/* init modules */
var sche = require('node-schedule');
var forecast = require('./services/forecast');
var update = require('./services/dataHandle/updateData');
var fs = require('fs');
var path = require('path');
var async = require('async');


/* start schedule */
module.exports = function() {
  var data = fs.readFileSync(path.join(__dirname, 'list.txt'), 'utf8');
  var list = data.split('\n');

  // load list of stocks
  for (var i = 0; i < list.length; i++) {
    list[i] = list[i].trim().toUpperCase();
  }

  // set up schedule
  sche.scheduleJob({
    hour: 8,
    minute: 6,
    dayOfWeek: [0, 1, 2, 3, 4, 5, 6]
  }, function() {
    var date = new Date();
    var dateParse = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    async.waterfall([
        // update list of StockMaster
        function(next) {
          update.listOfStocks(list, '2014-12-31', dateParse, function(listFail, time) {
            console.log();
            console.log('List fail update: ');
            console.log(listFail);
            console.log('Time: ' + (time / 1000 / 60) + ' mins');

            next();
          });
        },

        // update should buy list
        function(next) {
          console.log();
          console.log('Start forecast at ' + dateParse);
          forecast.shouldBuyingList(list, dateParse, function(err, list) {
            console.log('Finis forecast');
          });
        }
      ],
      // done
      function() {
        console.log('Finish schedule for ' + dateParse);
      });
  });
};
