const request = require('supertest');
const app = require('../src/app.js');
const connection = require('../src/db/connection.js');
const pool = connection.pool;

const invalid_id = require('./dummies.js').invalid_id;
const string_id = require('./dummies.js').string_id;
const dummyRole = require('./dummies.js').dummyRole;
const dummyIncompleteRole = require('./dummies.js').dummyIncompleteRole;

beforeAll(()=>{
  process.env.NODE_ENV = 'test';
});

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

describe('Role path test', () => {
  test('Test GET method', (done) => {
      request(app).get('/roles').then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('Test POST method', (done) => {
    request(app).post('/roles').set('Accept', /json/).send({role: dummyRole}).then((response) => {
      expect(response.statusCode).toBe(201);
      dummyRole.id = response.body.id;
      done();
    });
  });
  test('Test POST method with incomplete data', (done) => {
    request(app).post('/roles').set('Accept', /json/).send({role: dummyIncompleteRole}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test POST method with empty data', (done) => {
    request(app).post('/roles').set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test GET method with dummyRoleId', (done) => {
    request(app).get('/roles/'+dummyRole.id).then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body[0].id).toBe(dummyRole.id);
      expect(response.body[0].name).toBe(dummyRole.name);
      expect(response.body[0].description).toBe(dummyRole.description);
      done();
    });
  });
  test('Test GET method with invalid id', (done) => {
    request(app).get('/roles/'+invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test GET method with string id', (done) => {
    request(app).get('/roles/'+string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT method', (done) => {
    request(app).put('/roles/'+dummyRole.id).set('Accept', /json/).send({role: dummyRole}).then((response) => {
      expect(response.statusCode).toBe(202);
      expect(response.body[0].id).toBe(dummyRole.id);
      expect(response.body[0].name).toBe(dummyRole.name);
      expect(response.body[0].description).toBe(dummyRole.description);
      done();
    });
  });
  test('Test PUT method with incomplete data', (done) => {
    request(app).put('/roles/'+dummyRole.id).set('Accept', /json/).send({role: dummyIncompleteRole}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT method with invalid id', (done) => {
    request(app).put('/roles/'+invalid_id).set('Accept', /json/).send({role: dummyRole}).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test PUT method with string id', (done) => {
    request(app).put('/roles/'+string_id).set('Accept', /json/).send({role: dummyRole}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test DELETE method with dummyRoleId', (done) => {
    request(app).delete('/roles/'+dummyRole.id).then((response) => {
      expect(response.statusCode).toBe(204);
      done();
    });
  });
  test('Test DELETE method with non existing id', (done) => {
    request(app).delete('/roles/'+invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test DELETE method with string id', (done) => {
    request(app).delete('/roles/'+string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});