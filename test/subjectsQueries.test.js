const request = require('supertest');
const app = require('../src/app.js');
const connection = require('../src/db/connection.js');
const pool = connection.pool;

let dummySubject = {
  name: 'aassad',
  surname: 'casasda', 
  location: 'asdassad',
  contact: 'aasdasdafaddfsaasdfasdf'
};

let dummyIncompleteSubject = {
  name: 'aassad',
  surname: 'casasda', 
  location: 'asdassad',
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

describe('Subject path test', () => {
  test('Test GET method', (done) => {
      request(app).get('/subjects').then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('Test POST method', (done) => {
    request(app).post('/subjects').set('Accept', /json/).send({subject: dummySubject}).then((response) => {
      expect(response.statusCode).toBe(201);
      dummySubject.id = response.body.id;
      done();
    });
  });
  test('Test POST method with incomplete data', (done) => {
    request(app).post('/subjects').set('Accept', /json/).send({subject: dummyIncompleteSubject}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test POST method with empty data', (done) => {
    request(app).post('/subjects').set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test GET method with dummySubjectId', (done) => {
    request(app).get('/subjects/'+dummySubject.id).then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body[0].id).toBe(dummySubject.id);
      expect(response.body[0].name).toBe(dummySubject.name);
      expect(response.body[0].surname).toBe(dummySubject.surname);
      expect(response.body[0].location).toBe(dummySubject.location);
      expect(response.body[0].contact).toBe(dummySubject.contact);
      done();
    });
  });
  test('Test GET method with invalid id', (done) => {
    request(app).get('/subjects/'+invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test GET method with string id', (done) => {
    request(app).get('/subjects/'+string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT method', (done) => {
    request(app).put('/subjects/'+dummySubject.id).set('Accept', /json/).send({subject: dummySubject}).then((response) => {
      expect(response.statusCode).toBe(202);
      expect(response.body[0].id).toBe(dummySubject.id);
      expect(response.body[0].name).toBe(dummySubject.name);
      expect(response.body[0].surname).toBe(dummySubject.surname);
      expect(response.body[0].location).toBe(dummySubject.location);
      expect(response.body[0].contact).toBe(dummySubject.contact);
      done();
    });
  });
  test('Test PUT method with incomplete data', (done) => {
    request(app).put('/subjects/'+dummySubject.id).set('Accept', /json/).send({subject: dummyIncompleteSubject}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT method with invalid id', (done) => {
    request(app).put('/subjects/'+invalid_id).set('Accept', /json/).send({subject: dummySubject}).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test PUT method with string id', (done) => {
    request(app).put('/subjects/'+string_id).set('Accept', /json/).send({subject: dummySubject}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test DELETE method with dummySubjectId', (done) => {
    request(app).delete('/subjects/'+dummySubject.id).then((response) => {
      expect(response.statusCode).toBe(204);
      done();
    });
  });
  test('Test DELETE method with non existing id', (done) => {
    request(app).delete('/subjects/'+invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test DELETE method with string id', (done) => {
    request(app).delete('/subjects/'+string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});