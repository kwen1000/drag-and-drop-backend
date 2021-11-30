var express = require('express');
var path = require('path');
var pg = require('pg');
var ejs = require('ejs');
var dotenv = require('dotenv');
var app = express();
var port = 3000;
dotenv.config();
pg.defaults.ssl = true;
require('./src/models').sequelize.sync().then(function () {
    console.log('Synced PostgreSQL.');
})["catch"](function (err) {
    console.log(err);
});
// app.set('views', './views');
// app.set('view engine', 'ejs');
app.use(express.static('./src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', require('./src/controllers/index'));
app.use('/debug', require('./src/controllers/debug'));
app.use('/api/v1/users/', require('./src/controllers/users/users'));
app.use('/api/v1/posts/', require('./src/controllers/posts/posts'));
app.use('/api/v1/auth/', require('./src/controllers/auth'));
app.use('/api/v1/org/', require('./src/controllers/online'));
port = parseInt(process.env.PORT);
app.listen(port, function () {
    return console.log("Port ".concat(port, " opened."));
});
