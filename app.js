const express = require('express');
const path = require('path');
const Sequelize = require('sequelize');
const pg = require('pg');
const app = express();
// const helmet = require('helmet');
// const compression = require('compression');
// const rateLimit = require('express-rate-limit');
// const {body, check} = require('express-validator');

require('dotenv').config();
pg.defaults.ssl = true;

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.POSTGRESQL_URI;

require('./models').sequelize.sync().then(() => {
  console.log('Synced PostgreSQL.');
}).catch((err) => {
  console.log(err);
});

// app.use(compression());
// app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/',                    require('./routes/index'));
app.use('/api/auth/get-users',  require('./routes/users'));
app.use('/api/auth/get-posts',  require('./routes/posts'));
app.use("/api/auth/register",   require("./routes/register"));

app.listen(PORT, () => console.log(`Port ${PORT} opened.`));
