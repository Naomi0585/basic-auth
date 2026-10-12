'use strict';

const base64 = require('base-64');
const { Users } = require('../database');

async function basicAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization || '';

    if (!authorization.startsWith('Basic ')) {
      throw new Error('Invalid Login');
    }

    const encoded = authorization.slice(6);
    const decoded = base64.decode(encoded);

    const separator = decoded.indexOf(':');

    if (separator === -1) {
      throw new Error('Invalid Login');
    }

    const username = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);

    if (!username || !password) {
      throw new Error('Invalid Login');
    }

    const user = await Users.authenticateBasic(
      username,
      password
    );

    req.user = user;
    next();
  } catch (error) {
    const loginError = new Error('Invalid Login');
    loginError.status = 401;
    next(loginError);
  }
}

module.exports = basicAuth;