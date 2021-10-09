const express = require('express');
const path = require('path');
const pg = require('pg');
const ejs = require('ejs');
const Sequelize = require('sequelize');

const app = express();

// .env file required
require('dotenv').config();
pg.defaults.ssl = true;

const DB_URI = process.env.POSTGRESQL_URI;
var PORT = 3000;

require('./models').sequelize.sync().then(() => {
  console.log('Synced PostgreSQL.');
}).catch((err) => {
  console.log(err);
});

// Use views for visual testing if
// the command line is not enough 
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.json());

// Required for headers 
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/index'));
app.use('/debug', require('./routes/debug'));
app.use('/api/v1/auth/', require('./routes/auth'));
app.use('/api/v1/lobby/', require('./routes/lobby/lobby'));

if (process.env.PRODUCTION == true) {
  PORT = process.env.LOAD_PROD_PORT;
} else {
  PORT = process.env.LOAD_DEV_PORT
}

app.listen(PORT, () => 
  console.log(`Port ${PORT} opened.`)
);
