
'use strict';

const request = require('supertest');
const { app } = require('../server');
const { sequelize, Users } = require('../database');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Basic Authentication', () => {

  test('POST /signup creates a new user', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.username).toBe('testuser');
    expect(response.body.password).toBeUndefined();
  });

  test('POST /signin logs in successfully', async () => {
    const response = await request(app)
      .post('/signin')
      .auth('testuser', 'password123');

    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe('testuser');
  });

  test('POST /signin rejects incorrect passwords', async () => {
    const response = await request(app)
      .post('/signin')
      .auth('testuser', 'wrongpassword');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid Login');
  });

  test('POST /signin rejects missing credentials', async () => {
    const response = await request(app)
      .post('/signin');

    expect(response.status).toBe(401);
  });

  test('POST /signup accepts form data', async () => {
    const response = await request(app)
      .post('/signup')
      .type('form')
      .send({
        username: 'formuser',
        password: 'password456',
      });

    expect(response.status).toBe(201);
  });

  test('POST /signup rejects missing passwords', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        username: 'anotheruser',
      });

    expect(response.status).toBe(400);
  });

});
