const request = require('supertest');
const app = require('../src/app.js');
const connection = require('../src/db/connection.js');
const pool = connection.pool;

const invalid_id = require('./dummies.js').invalid_id;
const string_id = require('./dummies.js').string_id;
const adminRole = require('./dummies.js').adminRole;
const adminUser = require('./dummies.js').adminUser;
const dummyProject = require('./dummies.js').dummyProject;
const dummyDataCollection = require('./dummies.js').dummyDataCollection;
const dummyIncompleteDataCollection = require('./dummies.js').dummyIncompleteDataCollection;

beforeAll(async (done) => {
  process.env.NODE_ENV = 'test';
  await request(app).post('/roles').set('Accept', /json/).send({role: adminRole}).then(async (response) => {//creation of the role
    await request(app).post('/users').set('Accept', /json/).send({user: adminUser}).then(async (response) => {//creation of the user
      await request(app).post('/projects').set('Accept', /json/).send({project: dummyProject}).then((response) => {
        dummyProject.id = response.body.id;
        dummyDataCollection.project_id = response.body.id;
      });//creation of the project
    });
  });
  done();
});

afterAll(async () => {
  await request(app).delete('/projects/'+dummyProject.id).then(async (response) => {
    await request(app).delete('/users/' + adminUser.id).then(async (response) => {
      await request(app).delete('/roles/'+adminRole.id);
    });
  });
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

describe('Test /projects/:id/dataCollections method root path', () => {
  test('Test GET method', (done) => {
    request(app).get('/projects/' + dummyProject.id + "/dataCollections").then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  test('Test POST method', (done) => {
    request(app).post('/projects/' + dummyProject.id + "/dataCollections").set('Accept', /json/).send({data_collection: dummyDataCollection}).then((response) => {
      expect(response.statusCode).toBe(201);
      dummyDataCollection.id = response.body.id;
      done();
    });
  });
  test('Test POST method without data', (done) => {
    request(app).post('/projects/' + dummyProject.id + "/dataCollections").set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test POST method with incomplete data', (done) => {
    request(app).post('/projects/' + dummyProject.id + "/dataCollections").set('Accept', /json/).send({data_collection: dummyIncompleteDataCollection}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});
describe('Test /dataCollections method root path', () => {
  test('Test GET method with valid id', (done) => {
    request(app).get('/dataCollections/' + dummyDataCollection.id).set('Accept', /json/).send({project_id: dummyDataCollection.project_id}).then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body[0].id).toBe(dummyDataCollection.id);
      expect(response.body[0].name).toBe(dummyDataCollection.name);
      expect(response.body[0].description).toBe(dummyDataCollection.description);
      expect(response.body[0].type).toBe(dummyDataCollection.type);
      expect(response.body[0].start_date.substring(0,10)).toBe(dummyDataCollection.start_date.substring(0,10));
      expect(response.body[0].end_date.substring(0,10)).toBe(dummyDataCollection.end_date.substring(0,10));
      done();
    });
  });
  test('Test GET method with invalid id', (done) => {
    request(app).get('/dataCollections/' + invalid_id).set('Accept', /json/).send({project_id: dummyDataCollection.project_id}).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test GET method with string id', (done) => {
    request(app).get('/dataCollections/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT', (done) => {
    request(app).put('/dataCollections/' + dummyDataCollection.id).set('Accept', /json/).send({data_collection: dummyDataCollection}).then((response) => {
      expect(response.statusCode).toBe(202);
      expect(response.body[0].id).toBe(dummyDataCollection.id);
      expect(response.body[0].name).toBe(dummyDataCollection.name);
      expect(response.body[0].description).toBe(dummyDataCollection.description);
      expect(response.body[0].type).toBe(dummyDataCollection.type);
      expect(response.body[0].start_date.substring(0,10)).toBe(dummyDataCollection.start_date.substring(0,10));
      expect(response.body[0].end_date.substring(0,10)).toBe(dummyDataCollection.end_date.substring(0,10));
      done();
    });
  });
  test('Test PUT with incomplete date', (done) => {
    request(app).put('/dataCollections/' + dummyDataCollection.id).set('Accept', /json/).send({data_collection: dummyIncompleteDataCollection}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and incomplete data', (done) => {
    request(app).put('/dataCollections/' + invalid_id).set('Accept', /json/).send({data_collection: dummyIncompleteDataCollection}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with string id and incomplete data', (done) => {
    request(app).put('/dataCollections/' + string_id).set('Accept', /json/).send({data_collection: dummyIncompleteDataCollection}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and empty user', (done) => {
    request(app).put('/dataCollections/' + invalid_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with string id and empty user', (done) => {
    request(app).put('/dataCollections/' + string_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test DELETE', (done) => {
    request(app).delete('/dataCollections/' + dummyDataCollection.id).set('Accept', /json/).send({data_collection: dummyDataCollection}).then((response) => {
      expect(response.statusCode).toBe(204);
      done();
    });
  });
  test('Test DELETE with invalid id', (done) => {
    request(app).delete('/dataCollections/' + invalid_id).set('Accept', /json/).send({data_collection: dummyDataCollection}).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test DELETE with string id', (done) => {
    request(app).delete('/dataCollections/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});
