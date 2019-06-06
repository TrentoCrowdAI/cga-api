const request = require('supertest');
const app = require('../server/server.js');

let dummyUser = {
  id: '12',
  name: 'John',
  surname: 'Doe',
  email: 'email@email.com',
  password: 'securepassword'
};

beforeAll(() => {
  
});

afterAll(() => {
  
});