'use strict';

const express = require('express');
const cors = require('cors');

const authRoutes = require('./auth/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('Basic Auth Server Running');
});

app.use(authRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route Not Found',
  });
});

app.use((err, req, res, next) => {
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'Username already exists';
  }

  if (err.name === 'SequelizeValidationError') {
    status = 400;
  }

  res.status(status).json({
    error: message,
  });
});

function start(port) {
  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = {
  app,
  start,
};