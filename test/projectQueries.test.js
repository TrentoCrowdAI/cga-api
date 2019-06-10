const request = require('supertest');
const app = require('../src/app.js');
const connection = require('../src/db/connection.js');
const pool = connection.pool;

let dummyRole = {
  id: 1,
  name: 'ADMIN',
  description: 'admin role',
};

let dummyUser = {
  id: '1231231231231234',
  name: 'John',
  surname: 'Doe',
};

let dummyProject = {
  name: 'test',
  description: 'cga test',
  creation_date: '2019-01-01T01:00:00.000Z'
};

let dummyIncompleteProject = {
  name: 'test',
  description: 'cga test',
};

let invalid_id = 111111;
let string_id = "AAAA";

beforeAll(async (done) => {
  //await request(app).post('/roles').set('Accept', /json/).send({role: dummyRole});
  //await request(app).post('/users').set('Accept', /json/).send({user: dummyUser});
  done();
});

afterAll(() => {
  //await request(app).delete('/roles/'+dummyRole.id);
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
      dummyProject.id = response.body.id;
      done();
    });
  });
  test('Test POST method with incomplete data', (done) => {
    request(app).post('/projects').set('Accept', /json/).send({project: dummyIncompleteProject}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test POST method with empty data', (done) => {
    request(app).post('/projects').set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test GET method with dummyProjectId', (done) => {
    request(app).get('/projects/'+dummyProject.id).then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body[0].id).toBe(dummyProject.id);
      expect(response.body[0].name).toBe(dummyProject.name);
      expect(response.body[0].description).toBe(dummyProject.description);
      expect(response.body[0].creation_date.substring(0,10)).toBe(dummyProject.creation_date.substring(0,10)); //problem with date
      done();
    });
  });
  test('Test GET method with invalid id', (done) => {
    request(app).get('/projects/'+invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test GET method with string id', (done) => {
    request(app).get('/projects/'+string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT method', (done) => {
    request(app).put('/projects/'+dummyProject.id).set('Accept', /json/).send({project: dummyProject}).then((response) => {
      expect(response.statusCode).toBe(202);
      expect(response.body[0].id).toBe(dummyProject.id);
      expect(response.body[0].name).toBe(dummyProject.name);
      expect(response.body[0].description).toBe(dummyProject.description);
      expect(response.body[0].creation_date.substring(0,10)).toBe(dummyProject.creation_date.substring(0,10)); //problem with date
      done();
    });
  });
  test('Test PUT method with incomplete data', (done) => {
    request(app).put('/projects/'+dummyProject.id).set('Accept', /json/).send({project: dummyIncompleteProject}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT method with invalid id', (done) => {
    request(app).put('/projects/'+invalid_id).set('Accept', /json/).send({project: dummyProject}).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test PUT method with string id', (done) => {
    request(app).put('/projects/'+string_id).set('Accept', /json/).send({project: dummyProject}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test DELETE method with dummyProjectId', (done) => {
    request(app).delete('/projects/'+dummyProject.id).then((response) => {
      expect(response.statusCode).toBe(204);
      done();
    });
  });
  test('Test DELETE method with non existing id', (done) => {
    request(app).delete('/projects/'+invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test DELETE method with string id', (done) => {
    request(app).delete('/projects/'+string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});