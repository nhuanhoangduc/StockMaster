/*
 * @author: Hoang Duc Nhuan
 * Calculate base on data
 */


/* init modules */
var _ = require('underscore');

/*
 * Calculate sma value
 * @param {Array of number} closeValueList list of close value of an stock
 * @param {Number} timePeriod
 * @return {Number} sma
 */
var sma = function(closeValueList, timePeriod) {
  var sum = 0;

  for (var i = 0; i < timePeriod; i++) {
    var closeValue = closeValueList[i];
    sum += closeValue;
  }

  return (sum / timePeriod);
};


/* exports all function */
module.exports = {
  sma: sma
};
