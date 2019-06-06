const request = require('supertest');
const app = require('../src/app.js');
const connection = require('../src/db/connection.js');
const pool = connection.pool;

let dummyProject = {
  id: '12',
  name: 'test',
  description: 'cga test',
  creationDate: '2019-01-01'
};
 
afterAll(() => {
  pool.end();
});

describe('GENERIC user test cases', () => {
  it('app module should be defined', () => {
    expect(app).toBeDefined();
  });
});


describe('Test the root path', () => {
  test('It should response the GET method', (done) => {
      request(app).get('/').then((response) => {
          expect(response.statusCode).toBe(200);
          done();
      });
  });
});

describe('Test the root path', () => {
  test('It should response the GET method', (done) => {
      request(app).get('/projects').then((response) => {
          expect(response.statusCode).toBe(200);
          done();
      });
  });
});