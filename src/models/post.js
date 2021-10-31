const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const Post = sequelize.define('Post', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  content: {
    type: Sequelize.STRING
  },
  user_id: {
    type: Sequelize.INTEGER
  }
}, {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  timestamps: true,
  underscored: true,
  underscoredAll: true
}
)

module.exports = Post

