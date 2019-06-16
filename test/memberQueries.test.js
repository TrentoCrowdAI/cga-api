const request = require('supertest');
const app = require('../src/app.js');
const connection = require('../src/db/connection.js');
const pool = connection.pool;

const invalid_id = require('./dummies.js').invalid_id;
const string_id = require('./dummies.js').string_id;
const adminRole = require('./dummies.js').adminRole;
const adminUser = require('./dummies.js').adminUser;
const dummyProject = require('./dummies.js').dummyProject;
const dummyRole = require('./dummies.js').dummyRole;
const dummyUser = require('./dummies.js').dummyUser;
const dummyMember = require('./dummies.js').dummyMember;

beforeAll(async (done) => {
  process.env.NODE_ENV = 'test';
  await request(app).post('/roles').set('Accept', /json/).send({role: adminRole}).then(async (response) => {//creation of the role
    await request(app).post('/users').set('Accept', /json/).send({user: adminUser}).then(async (response) => {//creation of the user
      await request(app).post('/projects').set('Accept', /json/).send({project: dummyProject}).then(async (response) => {//creation of the project
        dummyProject.id = response.body.id;
        dummyMember.project_id = response.body.id;
        await request(app).post('/users').set('Accept', /json/).send({user: dummyUser}).then(async () => {
          await request(app).post('/roles').set('Accept', /json/).send({role: dummyRole});
        });
      });
    });
  });
  
  done();
});

afterAll(async () => {
  await request(app).delete('/projects/' + dummyProject.id).then(async (response) => {
    await request(app).delete('/users/' + adminUser.id).then(async (response) => {
      await request(app).delete('/roles/' + adminRole.id).then(async (response) => {
        await request(app).delete('/roles/' +dummyRole.id).then(async() => {
          await request(app).delete('/users/' + dummyUser.id);
        });
      });
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
  test('It should response the GET method', (done) => {
    request(app).get('/').then((response) => {
        expect(response.statusCode).toBe(200);
        done();
    });
  });
});

describe('Project path test', () => {
  test('Test GET method', (done) => {
      request(app).get('/projects/'+dummyProject.id+'/members').then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('Test POST method', (done) => {
    request(app).post('/projects/'+dummyProject.id+'/members').set('Accept', /json/).send({member: dummyMember}).then((response) => {
      expect(response.statusCode).toBe(201);
      done();
    });
  });
  test('Test POST method with incomplete data', (done) => {
    request(app).post('/projects/'+dummyProject.id+'/members').set('Accept', /json/).send({member: {}}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test POST method with empty data', (done) => {
    request(app).post('/projects/'+dummyProject.id+'/members').set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test GET method', (done) => {
    request(app).get('/projects/'+dummyProject.id+'/members/'+dummyMember.user_id).then((response) => {
      expect(response.statusCode).toBe(200);
      dummyMember.creation_date = response.body[1].creation_date;
      expect(response.body[1].status).toBe(dummyMember.status);
      expect(response.body[1].project_id).toBe(dummyMember.project_id);
      expect(response.body[1].user_id).toBe(dummyMember.user_id);
      expect(response.body[1].role_id).toBe(dummyMember.role_id);
      done();
    });
  });
  test('Test GET method with invalid id', (done) => {
    request(app).get('/projects/'+dummyProject.id+'/members/'+invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test GET method with string id', (done) => {
    request(app).get('/projects/'+dummyProject.id+'/members/'+string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT method', (done) => {
    request(app).put('/projects/'+dummyProject.id+'/members/'+dummyMember.user_id).set('Accept', /json/).send({member: dummyMember}).then((response) => {
      expect(response.statusCode).toBe(202);
      expect(response.body[0].status).toBe(dummyMember.status);
      expect(response.body[0].project_id).toBe(dummyMember.project_id);
      expect(response.body[0].user_id).toBe(dummyMember.user_id);
      expect(response.body[0].role_id).toBe(dummyMember.role_id);
      expect(response.body[0].creation_date.substring(0,10)).toBe(dummyMember.creation_date.substring(0,10));
      done();
    });
  });
  test('Test PUT method with incomplete data', (done) => {
    request(app).put('/projects/'+dummyProject.id+'/members/'+dummyMember.user_id).set('Accept', /json/).send({member: {}}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test DELETE method', (done) => {
    request(app).delete('/projects/'+dummyProject.id+'/members/'+dummyMember.user_id).then((response) => {
      expect(response.statusCode).toBe(204);
      done();
    });
  });
  test('Test DELETE method with non existing id', (done) => {
    request(app).delete('/projects/'+dummyProject.id+'/members/'+invalid_id).then((response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });
  test('Test DELETE method with string id', (done) => {
    request(app).delete('/projects/'+dummyProject.id+'/members/'+string_id).then((response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });
});
