const request = require('supertest');
const app = require('../src/app.js');
const connection = require('../src/db/connection.js');
const pool = connection.pool;
/*
let dummyProject = {
  name: 'test',
  description: 'cga test',
  creation_date: '2019-01-01T01:00:00.000Z'
};

let dummyUser = {
  id: '123123123123123',
  name: 'John',
  surname: 'Doe',
};

let dummyMember = {
  name: 'ADMIN',
  role_id: ,
  user_id: dummyUser,
  description: 'admin role',
};

let dummyIncompleteMember = {
  name: 'ADMIN',
};

let invalid_id = 111111;
let string_id = "AAAA";

beforeAll(()=>{
  request(app).post('/projects').set('Accept', /json/).send({project: dummyProject}).then((response) => {
    dummyProject.id = response.body.id;
    done();
  });
})

afterAll(() => {
  request(app).delete('/projects/' + dummyProject.id).send({project: dummyProject});
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
});*/