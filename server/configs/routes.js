module.exports = function(app) {
  // index page
  var indexRoute = require('../routes/index');
  app.use('/', indexRoute);
};
