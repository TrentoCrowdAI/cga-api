const request = require('supertest');
const app = require('../src/app.js');
const connection = require('../src/db/connection.js');
const pool = connection.pool;

let dummyProject = {
  name: 'test',
  description: 'cga test',
  creationDate: '2019-01-01'
};

let invalid_id = 111111;
let string_id = "AAAA";

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

describe('Project path test', () => {
  test('Test GET method', (done) => {
      request(app).get('/projects').then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('Test POST method', (done) => {
    request(app).post('/projects').set('Accept', /json/).send({project: dummyProject}).then((response) => {
      expect(response.statusCode).toBe(201);
      done();
    });
  });
  test('Test POST method with empty data', (done) => {
    request(app).post('/projects').set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test GET method with invalid id', (done) => {
    request(app).get('/projects/'+invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test PUT method with invalid id', (done) => {
    request(app).put('/projects/'+invalid_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test PUT method with no id', (done) => {
    request(app).put('/projects/').set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test DELETE method with non existing id', (done) => {
    request(app).delete('/projects/'+invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  /*test('Test DELETE method with string id', (done) => {
    request(app).delete('/projects/'+string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });*/
  test('Test DELETE method with no id', (done) => {
    request(app).delete('/projects/').then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
});