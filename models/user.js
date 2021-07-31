const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING(1024),
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING(1024),
    allowNull: false
  },
  email: {
    type: Sequelize.STRING(1024),
    allowNull: false
  },
  salt: {
    type: Sequelize.STRING(1024)
  },
  password_reset_code: {
    type: Sequelize.STRING(1024)
  }}, 
  {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
);

module.exports = User;
