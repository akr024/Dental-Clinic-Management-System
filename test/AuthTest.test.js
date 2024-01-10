const request = require('supertest');
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mockingoose = require('mockingoose');
const authRoutes = require('../routes/routes.js');
const bodyParser = require('body-parser');
require('../utils/authConfig');

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(passport.initialize());
app.use('/', authRoutes);

jest.mock('passport', () => ({
  authenticate: jest.fn(),
}));

describe('Authentication Routes', () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should return a token on successful login', async () => {
      mockingoose.Patient.toReturn({ _id: "user_id", email: 'user@example.com',personnummer:"8904125644",
      password:"dentist123" }, 'findOne');
      jwt.sign = jest.fn(() => 'mocked_token');
      const response = await request(app)
        .post('/login')
        .send({
          personnummer:'8904125644',
          password:'dentist123'
      }).set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.token).toEqual('mocked_token');
    });

    it('should return an error for invalid credentials', async () => {
      mockingoose.User.toReturn(null, 'findOne');

      const response = await request(app)
        .post('/login')
        .send({  });

      expect(response.status).toBe(401);
      expect(response.body.error).toEqual('Invalid credentials');
    });
  });

  describe('POST /dentist/login', () => {
    it('should return a user object on successful dentist login', async () => {
      mockingoose.Dentist.toReturn({ _id: '12345', email: 'dentist@example.com',personnummer:"7904125645",
      password:"dentist123" }, 'findOne');
      jwt.sign = jest.fn(() => 'mocked_token');

      const response = await request(app)
        .post('/dentist/login')
        .send({ personnummer:'7904125645',
        password:'dentist123' });
      const expectedResults = {
        email: 'dentist@example.com',
        clinics: new Array(),
        password: 'dentist123',
        personnummer: '7904125645',
      };
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(expectedResults));
      expect(response.body._id).toBeDefined();  
    });

    it('should return an error for invalid dentist credentials', async () => {
      mockingoose.User.toReturn(null, 'findOne');

      const response = await request(app)
        .post('/dentist/login')
        .send({
            username: 'invalidUsername',
            password: 'invalidPassword'});

      expect(response.status).toBe(401);
      expect(response.body.error).toEqual('Invalid credentials');
    });
  });
});