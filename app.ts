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

    require('./src/models').sequelize.sync().then(() => {
      console.log('Synced PostgreSQL.');
    }).catch((err) => {
      console.log(err);
    });

    // app.set('views', './views');
    // app.set('view engine', 'ejs');

    app.use(express.static('./src/public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/', require('./src/controllers/index'));
    app.use('/debug', require('./src/controllers/debug'));
    app.use('/api/v1/auth/', require('./src/controllers/auth'));
    app.use('/api/v1/org/', require('./src/controllers/online'));

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
