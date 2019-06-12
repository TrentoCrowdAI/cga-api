const request = require('supertest');
const app = require('../src/app.js');
const connection = require('../src/db/connection.js');
const pool = connection.pool;

let invalid_id = 1111;
let string_id = "asdasd";


let adminRole = {
  id: 1,
  name: 'ADMIN',
  description: 'admin role',
};

let adminUser = {
  id: '123123123123123',
  name: 'John',
  surname: 'Doe',
};

let dummyProject = {
  name: 'test',
  description: 'cga test',
  creation_date: '2019-01-01T01:00:00.000Z',
  user_id: adminUser.id
};

let dummyDataCollection = {
  name: "test", 
  description: "testads", 
  type:"aasdasd", 
  start_date:"2019-01-01T02:00:00.000Z", 
  end_date:"2019-10-01T02:00:00.000Z"
};

let dummySurvey = {
  name: "test survey",
  description: "ASDBJANDJAS"
};

let dummySurveyComponent = {
  name: 'test',
  role_id: adminRole.id,
}

let dummyIncompleteSurveyComponent = {
  role_id: adminRole.id,
};

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await request(app).post('/roles').set('Accept', /json/).send({role: adminRole}).then(async (response) => {//creation of the role
    await request(app).post('/users').set('Accept', /json/).send({user: adminUser}).then(async (response) => {//creation of the user
      await request(app).post('/projects').set('Accept', /json/).send({project: dummyProject}).then(async (response) => {//creation of the project
        dummyProject.id = response.body.id;
        dummyDataCollection.project_id = response.body.id;
        await request(app).post('/projects/' + dummyProject.id + "/dataCollections").set('Accept', /json/).send({data_collection: dummyDataCollection}).then(async (response) => {
          dummyDataCollection.id = response.body.id;
          dummySurvey.data_collection_id = response.body.id;
          await request(app).post('/dataCollections/' + dummyDataCollection.id + "/surveys").set('Accept', /json/).send({survey: dummySurvey}).then((response) => {
            dummySurvey.id = response.body.id;
            dummySurveyComponent.survey_id = response.body.id;
          });
        });
      });
    });
  });
});

afterAll(async () => {
  await request(app).delete('/surveys/' + dummySurveyComponent.id).set('Accept', /json/).send({survey: dummySurvey}).then(async () => {
    await request(app).delete('/dataCollections/' + dummyDataCollection.id).set('Accept', /json/).send({data_collection: dummyDataCollection}).then(async () => {
      await request(app).delete('/projects/'+dummyProject.id).then(async () => {
        await request(app).delete('/users/' + adminUser.id).then(async () => {
          await request(app).delete('/roles/'+adminRole.id);
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
  test('Test /', (done) => {
    request(app).get('/').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});

describe('Test /surveys/:id/surveyComponents method root path', () => {
  test('Test GET method', (done) => {
    request(app).get('/surveys/' + dummySurvey.id + "/surveyComponents").then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  test('Test POST method', (done) => {
    request(app).post('/surveys/' + dummySurvey.id + "/surveyComponents").set('Accept', /json/).send({survey_component: dummySurveyComponent}).then((response) => {
      expect(response.statusCode).toBe(201);
      dummySurveyComponent.id = response.body.id;
      done();
    });
  });
  test('Test POST method without data', (done) => {
    request(app).post('/surveys/' + dummySurvey.id + "/surveyComponents").set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test POST method with incomplete data', (done) => {
    request(app).post('/surveys/' + dummySurvey.id + "/surveyComponents").set('Accept', /json/).send({survey_component: dummyIncompleteSurveyComponent}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});
describe('Test /surveyComponents method root path', () => {
  test('Test GET method with valid id', (done) => {
    request(app).get('/surveyComponents/' + dummySurvey.id).set('Accept', /json/).send({survey_component: dummySurveyComponent}).then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body[0].id).toBe(dummySurveyComponent.id);
      expect(response.body[0].name).toBe(dummySurveyComponent.name);
      expect(response.body[0].role_id).toBe(dummySurveyComponent.role_id);
      expect(response.body[0].survey_id).toBe(dummySurveyComponent.survey_id);
      done();
    });
  });
  test('Test GET method with invalid id', (done) => {
    request(app).get('/surveyComponents/' + invalid_id).set('Accept', /json/).send({survey_component: dummySurveyComponent}).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test GET method with string id', (done) => {
    request(app).get('/surveyComponents/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT', (done) => {
    request(app).put('/surveyComponents/' + dummySurvey.id).set('Accept', /json/).send({survey_component: dummySurveyComponent}).then((response) => {
      expect(response.statusCode).toBe(202);
      expect(response.body[0].id).toBe(dummySurveyComponent.id);
      expect(response.body[0].name).toBe(dummySurveyComponent.name);
      expect(response.body[0].role_id).toBe(dummySurveyComponent.role_id);
      expect(response.body[0].survey_id).toBe(dummySurveyComponent.survey_id);
      done();
    });
  });
  test('Test PUT with incomplete date', (done) => {
    request(app).put('/surveyComponents/' + dummySurvey.id).set('Accept', /json/).send({survey_component: dummyIncompleteSurveyComponent}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and incomplete data', (done) => {
    request(app).put('/surveyComponents/' + invalid_id).set('Accept', /json/).send({survey_component: dummyIncompleteSurveyComponent}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with string id and incomplete data', (done) => {
    request(app).put('/surveyComponents/' + string_id).set('Accept', /json/).send({survey_component: dummyIncompleteSurveyComponent}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and empty user', (done) => {
    request(app).put('/surveyComponents/' + invalid_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with string id and empty user', (done) => {
    request(app).put('/surveyComponents/' + string_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test DELETE', (done) => {
    request(app).delete('/surveyComponents/' + dummySurvey.id).then((response) => {
      expect(response.statusCode).toBe(204);
      done();
    });
  });
  test('Test DELETE with invalid id', (done) => {
    request(app).delete('/surveyComponents/' + invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test DELETE with string id', (done) => {
    request(app).delete('/surveyComponents/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});