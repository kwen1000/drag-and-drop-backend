const express = require('express');
const path = require('path');
const Sequelize = require('sequelize');
const pg = require('pg');
const app = express();

require('dotenv').config();
pg.defaults.ssl = true;

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.POSTGRESQL_URI;
const { sequelize } = require('./models');
var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');

sequelize.sync().then(() => {
  console.log('Synced PostgreSQL.');
}).catch((err) => {
  console.log(err);
});

app.use('/', index);
app.use('/get-users', users);
app.use('/get-posts', posts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => console.log(`Port ${PORT} opened.`));
