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
  creation_date: '2019-01-01T01:00:00.000Z',
  user_id: dummyUser.id
};


let dummyMember = {
  role_id: dummyRole.id,
  user_id: dummyUser.id,
  status: 'ACTIVE'
};

let dummyIncompleteMember = {
  status: 'ACTIVE'
};

let invalid_id = 111111;
let string_id = "AAAA";

beforeAll(async (done) => {
  await request(app).post('/roles').set('Accept', /json/).send({role: dummyRole}).then(async (response) => {//creation of the role
    await request(app).post('/users').set('Accept', /json/).send({user: dummyUser}).then(async (response) => {//creation of the user
      await request(app).post('/projects').set('Accept', /json/).send({project: dummyProject}).then(async (response) => {//creation of the project
        dummyProject.id = response.body.id;
        dummyMember.project_id = response.body.id;
      });
    });
  });
  done();
});

afterAll(async () => {
  await request(app).delete('/projects/'+dummyProject.id).then(async (response) => {
    await request(app).delete('/users/' + dummyUser.id).then(async (response) => {
      await request(app).delete('/roles/'+dummyRole.id).then(async (response) => {
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
    request(app).post('/projects/'+dummyProject.id+'/members').set('Accept', /json/).send({member: dummyIncompleteMember}).then((response) => {
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
      dummyMember.creation_date = response.body[0].creation_date;
      expect(response.body[0].status).toBe(dummyMember.status);
      expect(response.body[0].project_id).toBe(dummyMember.project_id);
      expect(response.body[0].user_id).toBe(dummyMember.user_id);
      expect(response.body[0].role_id).toBe(dummyMember.role_id);
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
    request(app).put('/projects/'+dummyProject.id+'/members/'+dummyMember.user_id).set('Accept', /json/).send({member: dummyIncompleteMember}).then((response) => {
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
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test DELETE method with string id', (done) => {
    request(app).delete('/projects/'+dummyProject.id+'/members/'+string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});