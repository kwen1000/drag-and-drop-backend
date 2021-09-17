const express = require('express');
const path = require('path');
const pg = require('pg');
const ejs = require('ejs');
const Sequelize = require('sequelize');

const app = express();

require('dotenv').config();
pg.defaults.ssl = true;

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.POSTGRESQL_URI;

require('./models').sequelize.sync().then(() => {
  console.log('Synced PostgreSQL.');
}).catch((err) => {
  console.log(err);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth/register",   require("./routes/register"));
app.use("/api/auth/login",      require("./routes/login"));
app.use('/api/auth/get-users',  require('./routes/users'));
app.use('/api/auth/get-posts',  require('./routes/posts'));
app.use('/',                    require('./routes/index'));
app.use('/debug',               require('./routes/debug'));

app.listen(PORT, () => console.log(`Port ${PORT} opened.`));
