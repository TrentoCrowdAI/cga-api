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
const dummySurveyItem = require('./dummies.js').dummySurveyItem;
const dummySubject = require('./dummies.js').dummySubject;
const dummyResponse = require('./dummies.js').dummyResponse;
const dummyComponentResponse = require('./dummies.js').dummyComponentResponse;

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
          await request(app).post('/dataCollections/' + dummyDataCollection.id + "/surveys").set('Accept', /json/).send({survey: dummySurvey}).then(async (response) => {
            dummySurvey.id = response.body.id;
            dummySurveyComponent.survey_id = response.body.id;
            dummyResponse.survey_id = response.body.id;
            await request(app).post('/surveys/' + dummySurvey.id + "/surveyComponents").set('Accept', /json/).send({survey_component: dummySurveyComponent}).then(async (response) => {
              dummySurveyComponent.id = response.body.id;
              dummyComponentResponse.survey_component_id = response.body.id;
              dummySurveyItem.survey_component_id = response.body.id;
              await request(app).post('/surveyComponents/' + dummySurveyComponent.id + "/surveyItems").set('Accept', /json/).send({survey_item: dummySurveyItem}).then(async (response) => {
                dummySurveyItem.id = response.body.id;
                await request(app).post('/subjects').set('Accept', /json/).send({subject: dummySubject}).then(async (response) => {
                  dummySubject.id = response.body.id;
                  dummyResponse.subject_id = response.body.id;
                  await request(app).post('/surveys/' + dummySurvey.id + "/subjects").set('Accept', /json/).send({subject: dummySubject}).then((response) => {
                    dummyResponse.id = response.body.id;
                    dummyComponentResponse.survey_response_id = response.body.id;
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

afterAll(async () => {
  await request(app).delete('/responses/' + dummyResponse.id).then(async () => {
    await request(app).delete('/subjects/' + dummySubject.id).then(async () => {
      await request(app).delete('/surveyItems/' + dummySurveyItem.id).then(async () => {
        await request(app).delete('/surveyComponents/' + dummySurveyComponent.id).then(async () => {
          await request(app).delete('/surveys/' + dummySurvey.id).set('Accept', /json/).send({survey: dummySurvey}).then(async () => {
            await request(app).delete('/dataCollections/' + dummyDataCollection.id).set('Accept', /json/).send({data_collection: dummyDataCollection}).then(async () => {
              await request(app).delete('/projects/'+dummyProject.id+"/members/"+dummyUser.id).then(async () => {
                await request(app).delete('/projects/' + dummyProject.id).then(async () => {
                  await request(app).delete('/users/' + dummyUser.id).then(async () => {
                    await request(app).delete('/roles/' + adminRole.id);
                  });
                });
              });
            });
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

describe('Testing dataCollection endpoint for tablet', () => {
  test('Test endpoint for getting the subjects assigned to a user', (done) => {
    request(app).get('/dataCollections/' + dummyDataCollection.id + '/subjects').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  test('Test endpoint for getting the subjects assigned to a user with invalid id', (done) => {
    request(app).get('/dataCollections/' + invalid_id + '/subjects').then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(0);
      done();
    });
  });
  test('Test endpoint for getting the subjects assigned to a user with string id', (done) => {
    request(app).get('/dataCollections/' + string_id + '/subjects').then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Testing the endpoint in order to get the surveys assinged to a subject', (done) => {
    request(app).get('/dataCollections/' + dummyDataCollection.id + '/subjects/' + dummySubject.id + '/surveys').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  test('Testing the endpoint in order to get the surveys assinged to a subject with invalid id', (done) => {
    request(app).get('/dataCollections/' + invalid_id + '/subjects/' + invalid_id + '/surveys').then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(0);
      done();
    });
  });
  test('Testing the endpoint in order to get the surveys assinged to a subject with string id', (done) => {
    request(app).get('/dataCollections/' + string_id + '/subjects/' + string_id + '/surveys').then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});