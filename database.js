
'use strict';

require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = process.env.NODE_ENV === 'test'
  ? new Sequelize('sqlite::memory:', {
      logging: false,
    })
  : new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
    });

const defineUser = require('./auth/model');

const Users = defineUser(sequelize, DataTypes);

module.exports = {
  sequelize,
  Users,
};
