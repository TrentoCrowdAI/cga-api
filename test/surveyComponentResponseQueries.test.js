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

describe('Test /responses/:id/componentResponses method root path', () => {
  test('Test GET method', (done) => {
    request(app).get('/responses/' + dummyResponse.id + "/componentResponses").then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  test('Test POST method', (done) => {
    request(app).post('/responses/' + dummyResponse.id + "/componentResponses").set('Accept', /json/).send({survey_component_response: dummyComponentResponse}).then((response) => {
      expect(response.statusCode).toBe(201);
      dummyComponentResponse.id = response.body.id;
      done();
    });
  });
  test('Test GET method after data creation', (done) => {
    request(app).get('/responses/' + dummyResponse.id + "/componentResponses").then((response) => {
      expect(response.statusCode).toBe(200);
      dummyComponentResponse.status = response.body[0].status;
      dummyComponentResponse.creation_date = response.body[0].creation_date;
      dummyComponentResponse.survey_response_id = response.body[0].survey_response_id;
      dummyComponentResponse.user_id = response.body[0].user_id;
      expect(response.body.length).not.toBe(0);
      done();
    });
  });
  test('Test POST method without data', (done) => {
    request(app).post('/responses/' + dummyComponentResponse.id + "/componentResponses").set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test POST method with incomplete data', (done) => {
    request(app).post('/responses/' + dummyComponentResponse.id + "/componentResponses").set('Accept', /json/).send({user: {}}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });  
});
describe('Test /componentResponses method root path', () => {
  test('Test GET method with valid id', (done) => {
    request(app).get('/componentResponses/' + dummyComponentResponse.id).set('Accept', /json/).send().then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body[0].id).toBe(dummyComponentResponse.id);
      expect(response.body[0].status).toBe(dummyComponentResponse.status);
      expect(response.body[0].creation_date.substring(0,10)).toBe(dummyComponentResponse.creation_date.substring(0,10)); //problem with date
      expect(response.body[0].survey_response_id).toBe(dummyComponentResponse.survey_response_id);
      expect(response.body[0].user_id).toBe(dummyComponentResponse.user_id);
      done();
    });
  });
  test('Test GET method with invalid id', (done) => {
    request(app).get('/componentResponses/' + invalid_id).set('Accept', /json/).send({survey_component_response: dummyComponentResponse}).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test GET method with string id', (done) => {
    request(app).get('/componentResponses/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test GET subject method', (done) => {
    request(app).get('/componentResponses/' + dummyComponentResponse.id).then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  test('Test GET subject method with invalid_id', (done) => {
    request(app).get('/componentResponses/' + invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test GET subject method with string_id', (done) => {
    request(app).get('/componentResponses/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT', (done) => {
    request(app).put('/componentResponses/' + dummyComponentResponse.id).set('Accept', /json/).send({survey_component_response: dummyComponentResponse}).then((response) => {
      expect(response.statusCode).toBe(202);
      expect(response.body[0].id).toBe(dummyComponentResponse.id);
      expect(response.body[0].status).toBe(dummyComponentResponse.status);
      expect(response.body[0].creation_date.substring(0,10)).toBe(dummyComponentResponse.creation_date.substring(0,10)); //problem with date
      expect(response.body[0].survey_response_id).toBe(dummyComponentResponse.survey_response_id);
      expect(response.body[0].user_id).toBe(dummyComponentResponse.user_id);
      done();
    });
  });
  test('Test PUT with incomplete date', (done) => {
    request(app).put('/componentResponses/' + dummyComponentResponse.id).set('Accept', /json/).send({survey_component_response: {}}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and incomplete data', (done) => {
    request(app).put('/componentResponses/' + invalid_id).set('Accept', /json/).send({survey_component_response: {}}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with string id and incomplete data', (done) => {
    request(app).put('/componentResponses/' + string_id).set('Accept', /json/).send({survey_component_response: {}}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and empty data', (done) => {
    request(app).put('/componentResponses/' + invalid_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with string id and empty data', (done) => {
    request(app).put('/componentResponses/' + string_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test DELETE', (done) => {
    request(app).delete('/componentResponses/' + dummyComponentResponse.id).then((response) => {
      expect(response.statusCode).toBe(204);
      done();
    });
  });
  test('Test DELETE with invalid id', (done) => {
    request(app).delete('/componentResponses/' + invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test DELETE with string id', (done) => {
    request(app).delete('/componentResponses/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});