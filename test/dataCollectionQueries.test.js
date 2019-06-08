const request = require('supertest');
const app = require('../src/app.js');
const connection = require('../src/db/connection.js');
const pool = connection.pool;

let invalid_id = 1111;
let string_id = "asdasd";

let dummyProject = {
  name: 'test',
  description: 'cga test',
  creation_date: '2019-01-01T02:00:00.000Z'
};

let dummyDataCollection = {
  name: "test", 
  description: "testads", 
  type:"aasdasd", 
  start_date:"2019-01-01T02:00:00.000Z", 
  end_date:"2019-10-01T02:00:00.000Z"
};

let dummyIncompleteDataCollection = {
  name: "test", 
  description: "testads", 
  type:"aasdasd", 
  start_date:"2019-01-01T02:00:00.000Z", 
};

beforeAll(async (done) => {
  await request(app).post('/projects').set('Accept', /json/).send({project: dummyProject}).then((response) => {
    dummyProject.id = response.body.id;
    dummyDataCollection.project_id = response.body.id;
  });
  done();
});

afterAll(async (done) => {
  await request(app).delete('/projects/'+dummyProject.id);
  pool.end();
  done();
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