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
const dummyItemResponse = require('./dummies.js').dummyItemResponse;

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
                dummyItemResponse.survey_item_id = response.body.id;
                await request(app).post('/subjects').set('Accept', /json/).send({subject: dummySubject}).then(async (response) => {
                  dummySubject.id = response.body.id;
                  dummyResponse.subject_id = response.body.id;
                  await request(app).post('/surveys/' + dummySurvey.id + "/subjects").set('Accept', /json/).send({subject: dummySubject}).then(async (response) => {
                    dummyResponse.id = response.body[0].id;
                    dummyResponse.status = response.body[0].status;
                    dummyResponse.creation_date = response.body[0].creation_date;
                    dummyComponentResponse.survey_response_id = response.body[0].id;
                    await request(app).post('/responses/' + dummyResponse.id + "/componentResponses").set('Accept', /json/).send({survey_component_response: dummyComponentResponse}).then((response) => {
                      dummyComponentResponse.id = response.body[0].id;
                      dummyComponentResponse.status = response.body[0].status;
                      dummyComponentResponse.creation_date = response.body[0].creation_date;
                      dummyComponentResponse.survey_response_id = response.body[0].survey_response_id;
                      dummyComponentResponse.user_id = response.body[0].user_id;
                      dummyItemResponse.survey_component_response_id = response.body[0].id;
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
});

afterAll(async () => {
  await request(app).delete('/componentResponses/' + dummyComponentResponse.id).then(async () => {
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
  });
  pool.end();
});

describe('Test /componentResponses/:id/itemResponses method root path', () => {
  test('Test GET method', (done) => {
    request(app).get('/componentResponses/' + dummyComponentResponse.id + "/itemResponses").then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  test('Test POST method', (done) => {
    request(app).post('/componentResponses/' + dummyComponentResponse.id + "/itemResponses").set('Accept', /json/).send({survey_item_response: dummyItemResponse}).then((response) => {
      expect(response.statusCode).toBe(201);
      dummyItemResponse.id = response.body.id;
      done();
    });
  });
  test('Test GET method after data creation', (done) => {
    request(app).get('/componentResponses/' + dummyComponentResponse.id + "/itemResponses").then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.length).not.toBe(0);
      done();
    });
  });
  test('Test POST method without data', (done) => {
    request(app).post('/componentResponses/' + dummyComponentResponse.id + "/itemResponses").set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test POST method with incomplete data', (done) => {
    request(app).post('/componentResponses/' + dummyComponentResponse.id + "/itemResponses").set('Accept', /json/).send({survey_item_response: {}}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});
describe('Test /componentResponses method root path', () => {
  test('Test GET method with valid id', (done) => {
    request(app).get('/itemResponses/' + dummyItemResponse.id).set('Accept', /json/).send().then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body[0].id).toBe(dummyItemResponse.id);
      expect(response.body[0].name).toBe(dummyItemResponse.name);
      expect(response.body[0].value).toBe(dummyItemResponse.value); 
      expect(response.body[0].survey_item_id).toBe(dummyItemResponse.survey_item_id);
      expect(response.body[0].survey_component_response_id).toBe(dummyItemResponse.survey_component_response_id);
      done();
    });
  });
  test('Test GET method with invalid id', (done) => {
    request(app).get('/itemResponses/' + invalid_id).set('Accept', /json/).send({survey_item_response: dummyItemResponse}).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test GET method with string id', (done) => {
    request(app).get('/itemResponses/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test GET subject method', (done) => {
    request(app).get('/itemResponses/' + dummyItemResponse.id).then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  test('Test GET subject method with invalid_id', (done) => {
    request(app).get('/itemResponses/' + invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test GET subject method with string_id', (done) => {
    request(app).get('/itemResponses/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT', (done) => {
    request(app).put('/itemResponses/' + dummyItemResponse.id).set('Accept', /json/).send({survey_item_response: dummyItemResponse}).then((response) => {
      expect(response.statusCode).toBe(202);
      expect(response.body[0].id).toBe(dummyItemResponse.id);
      expect(response.body[0].name).toBe(dummyItemResponse.name);
      expect(response.body[0].value).toBe(dummyItemResponse.value); 
      expect(response.body[0].survey_item_id).toBe(dummyItemResponse.survey_item_id);
      expect(response.body[0].survey_component_response_id).toBe(dummyItemResponse.survey_component_response_id);
      done();
    });
  });
  test('Test PUT with incomplete date', (done) => {
    request(app).put('/itemResponses/' + dummyItemResponse.id).set('Accept', /json/).send({survey_item_response: {}}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and incomplete data', (done) => {
    request(app).put('/itemResponses/' + invalid_id).set('Accept', /json/).send({survey_item_response: {}}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with string id and incomplete data', (done) => {
    request(app).put('/itemResponses/' + string_id).set('Accept', /json/).send({survey_item_response: {}}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and empty data', (done) => {
    request(app).put('/itemResponses/' + invalid_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with string id and empty data', (done) => {
    request(app).put('/itemResponses/' + string_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test DELETE', (done) => {
    request(app).delete('/itemResponses/' + dummyItemResponse.id).then((response) => {
      expect(response.statusCode).toBe(204);
      done();
    });
  });
  test('Test DELETE with invalid id', (done) => {
    request(app).delete('/itemResponses/' + invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test DELETE with string id', (done) => {
    request(app).delete('/itemResponses/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});