"use strict";
exports.__esModule = true;
var express_1 = require("express");
var path = require('path');
var pg = require('pg');
var ejs = require('ejs');
var dotenv = require('dotenv');
var app = express_1["default"]();
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
app.use(express_1["default"].static('./src/public'));
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
app.use('/', require('./src/controllers/index'));
app.use('/debug', require('./src/controllers/debug'));
app.use('/api/v1/auth/', require('./src/controllers/auth'));
app.use('/api/v1/org/', require('./src/controllers/online'));
if (process.env.PRODUCTION == "true") {
    port = parseInt(process.env.LOAD_PROD_PORT);
}
else {
    port = parseInt(process.env.LOAD_DEV_PORT);
}
app.listen(port, function () {
    return console.log("Port " + port + " opened.");
});
