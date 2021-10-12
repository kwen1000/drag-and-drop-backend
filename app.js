const express = require('express');
const path = require('path');
const pg = require('pg');
const ejs = require('ejs');
const dotenv = require('dotenv');

class App {

  constructor() {

    var app = express();
    var port = 3000;

    dotenv.config();
    pg.defaults.ssl = true;

    require('./models').sequelize.sync().then(() => {
      console.log('Synced PostgreSQL.');
    }).catch((err) => {
      console.log(err);
    });

    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/', require('./routes/index'));
    app.use('/debug', require('./routes/debug'));
    app.use('/api/v1/auth/', require('./routes/auth'));
    app.use('/api/v1/org/', require('./routes/online'));

    if (process.env.PRODUCTION == true) {
      port = process.env.LOAD_PROD_PORT;
    } else {
      port = process.env.LOAD_DEV_PORT
    }

    app.listen(port, () => 
      console.log(`Port ${port} opened.`)
    );
  }
}

new App();
