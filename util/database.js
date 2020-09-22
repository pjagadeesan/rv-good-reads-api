const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('rv_good_reads', 'root', 'nodejs20', {
  dialect: 'mysql',
  host: 'localhost',
  //storage: './session.mysql'
});

module.exports = sequelize;
