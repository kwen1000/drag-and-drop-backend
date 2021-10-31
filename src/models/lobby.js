const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Lobby = sequelize.define('Lobby', {
  org_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  number: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  current_data: {
    type: Sequelize.ARRAY(Sequelize.JSON),
    allowNull: true
  }
})

module.exports = Lobby

