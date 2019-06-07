const request = require('supertest');
const app = require('../src/app.js');
const connection = require('../src/db/connection.js');
const pool = connection.pool;

let invalid_id = '1111';
let string_id = "asdasd";

let dummyUser = {
  id: '123123123123123',
  name: 'John',
  surname: 'Doe',
};

let dummyIncompleteUser = {
  id: '123123123123123',
  name: 'John',
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
  test('Test /', (done) => {
    request(app).get('/').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});

describe('Test /users method root path', () => {
  test('Test GET method', (done) => {
    request(app).get('/users').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  test('Test POST method', (done) => {
    request(app).post('/users').set('Accept', /json/).send({user: dummyUser}).then((response) => {
      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBe(dummyUser.id);
      done();
    });
  });
  test('Test POST method without data', (done) => {
    request(app).post('/users').set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test POST method without incomplete data', (done) => {
    request(app).post('/users').set('Accept', /json/).send({dummyIncompleteUser}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test GET method with valid id', (done) => {
    request(app).get('/users/' + dummyUser.id).then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body[0].id).toBe(dummyUser.id);
      expect(response.body[0].name).toBe(dummyUser.name);
      expect(response.body[0].surname).toBe(dummyUser.surname);
      done();
    });
  });
  test('Test GET method with invalid id', (done) => {
    request(app).get('/users/' + invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test GET method with string id', (done) => {
    request(app).get('/users/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT', (done) => {
    request(app).put('/users/' + dummyUser.id).set('Accept', /json/).send({user: dummyUser}).then((response) => {
      expect(response.statusCode).toBe(202);
      expect(response.body[0].id).toBe(dummyUser.id);
      expect(response.body[0].name).toBe(dummyUser.name);
      expect(response.body[0].surname).toBe(dummyUser.surname);
      done();
    });
  });
  test('Test PUT with incomplete date', (done) => {
    request(app).put('/users/' + dummyUser.id).set('Accept', /json/).send({user: dummyIncompleteUser}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and incomplete data', (done) => {
    request(app).put('/users/' + invalid_id).set('Accept', /json/).send({user: dummyIncompleteUser}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with string id and incomplete data', (done) => {
    request(app).put('/users/' + string_id).set('Accept', /json/).send({user: dummyIncompleteUser}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and empty user', (done) => {
    request(app).put('/users/' + invalid_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with string id and empty user', (done) => {
    request(app).put('/users/' + string_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test DELETE', (done) => {
    request(app).delete('/users/' + dummyUser.id).then((response) => {
      expect(response.statusCode).toBe(204);
      done();
    });
  });
  test('Test DELETE with invalid id', (done) => {
    request(app).delete('/users/' + invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test DELETE with string id', (done) => {
    request(app).delete('/users/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});
