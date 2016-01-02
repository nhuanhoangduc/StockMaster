var mongoose = require('mongoose');

/* connect local database */
//mongoose.connect('mongodb://localhost:27017/stockDB');

/* connect database hosting */
mongoose.connect('mongodb://nhuanhoangduc:vansay@ds037145.mongolab.com:37145/nhuandb');

module.exports = mongoose;
