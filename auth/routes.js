'use strict';

const express = require('express');
const router = express.Router();

const { Users } = require('../database');
const basicAuth = require('./middleware');

function publicUser(user) {
  const { password, ...safeUser } = user.get({ plain: true });
  return safeUser;
}

router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (
      typeof username !== 'string' ||
      !username.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      const error = new Error('Username and password are required');
      error.status = 400;
      throw error;
    }

    const user = await Users.create({
      username: username.trim(),
      password,
    });

    res.status(201).json(publicUser(user));
  } catch (error) {
    next(error);
  }
});

router.post('/signin', basicAuth, (req, res) => {
  res.status(200).json({
    user: publicUser(req.user),
  });
});

module.exports = router;