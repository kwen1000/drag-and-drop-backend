const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  access_token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refresh_token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  administrator: {
    type: Sequelize.BOOLEAN,
    default: false
  }, 
  moderator: {
    type: Sequelize.BOOLEAN,
    default: false
  }, 
  plan: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
}, {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  timestamps: true,
  underscored: true,
  underscoredAll: true
})

module.exports = User

