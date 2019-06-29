const request = require('supertest');
const app = require('../src/app.js');
const connection = require('../src/db/connection.js');
const pool = connection.pool;

const invalid_id = require('./dummies.js').invalid_id;
const string_id = require('./dummies.js').string_id;
const adminRole = require('./dummies.js').adminRole;
const dummyUser = require('./dummies.js').dummyUser;
const dummyProject = require('./dummies.js').dummyProject;
const dummyDataCollection = require('./dummies.js').dummyDataCollection;
const dummySurvey = require('./dummies.js').dummySurvey;
const dummySurveyComponent = require('./dummies.js').dummySurveyComponent;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await request(app).post('/roles').set('Accept', /json/).send({role: adminRole}).then(async (response) => {//creation of the role
    await request(app).post('/users').set('Accept', /json/).send({user: dummyUser}).then(async (response) => {//creation of the user
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
  await request(app).delete('/surveys/' + dummySurvey.id).set('Accept', /json/).send({survey: dummySurvey}).then(async () => {
    await request(app).delete('/dataCollections/' + dummyDataCollection.id).set('Accept', /json/).send({data_collection: dummyDataCollection}).then(async () => {
      await request(app).delete('/projects/'+dummyProject.id+"/members/"+dummyUser.id).then(async (response) => {
        await request(app).delete('/projects/'+dummyProject.id).then(async () => {
          await request(app).delete('/users/' + dummyUser.id).then(async () => {
            await request(app).delete('/roles/'+adminRole.id);
          });
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
    request(app).post('/surveys/' + dummySurvey.id + "/surveyComponents").set('Accept', /json/).send({survey_component: {}}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});
describe('Test /surveyComponents method root path', () => {
  
  test('Test GET method with valid id', async (done) => {
    await request(app).get('/surveyComponents/' + dummySurveyComponent.id).set('Accept', /json/).send({survey_component: dummySurveyComponent}).then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(dummySurveyComponent.id);
      expect(response.body.name).toBe(dummySurveyComponent.name);
      expect(response.body.role_id).toBe(dummySurveyComponent.role_id);
      expect(response.body.survey_id).toBe(dummySurveyComponent.survey_id);
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
    request(app).put('/surveyComponents/' + dummySurveyComponent.id).set('Accept', /json/).send({survey_component: dummySurveyComponent}).then((response) => {
      expect(response.statusCode).toBe(202);
      expect(response.body[0].id).toBe(dummySurveyComponent.id);
      expect(response.body[0].name).toBe(dummySurveyComponent.name);
      expect(response.body[0].role_id).toBe(dummySurveyComponent.role_id);
      expect(response.body[0].survey_id).toBe(dummySurveyComponent.survey_id);
      done();
    });
  });
  test('Test PUT with incomplete date', (done) => {
    request(app).put('/surveyComponents/' + dummySurveyComponent.id).set('Accept', /json/).send({survey_component: {}}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and incomplete data', (done) => {
    request(app).put('/surveyComponents/' + invalid_id).set('Accept', /json/).send({survey_component: {}}).then((response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });
  test('Test PUT with string id and incomplete data', (done) => {
    request(app).put('/surveyComponents/' + string_id).set('Accept', /json/).send({survey_component: {}}).then((response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });
  test('Test PUT with invalid id and empty data', (done) => {
    request(app).put('/surveyComponents/' + invalid_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });
  test('Test PUT with string id and empty data', (done) => {
    request(app).put('/surveyComponents/' + string_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });
  test('Test DELETE', (done) => {
    request(app).delete('/surveyComponents/' + dummySurveyComponent.id).then((response) => {
      expect(response.statusCode).toBe(204);
      done();
    });
  });
  test('Test DELETE with invalid id', (done) => {
    request(app).delete('/surveyComponents/' + invalid_id).then((response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });
  test('Test DELETE with string id', (done) => {
    request(app).delete('/surveyComponents/' + string_id).then((response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });
});