require('dotenv').config();
const { sequelize } = require('../models');

sequelize.drop().then(() => {
  console.log('Successfully dropped');
  process.exit(0);
}).catch((err) => {
  console.log(err);
  process.exit(0);
});
