'use strict';

require('dotenv').config();

const { sequelize } = require('./database');
const { start } = require('./server');

const PORT = process.env.PORT || 3000;

async function initialize() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log('Database connected');

    start(PORT);
  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
}

initialize();