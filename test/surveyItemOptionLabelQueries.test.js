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
const dummySurvey = require('./dummies.js').dummySurvey;
const dummySurveyComponent = require('./dummies.js').dummySurveyComponent;
const dummySurveyItem = require('./dummies.js').dummySurveyItem;
const dummySurveyItemOption = require('./dummies.js').dummySurveyItemOption;
const dummySurveyItemOptionLabel = require('./dummies.js').dummySurveyItemOptionLabel;
const dummyIncompleteSurveyItemOptionLabel = require('./dummies.js').dummyIncompleteSurveyItemOptionLabel;

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
          await request(app).post('/dataCollections/' + dummyDataCollection.id + "/surveys").set('Accept', /json/).send({survey: dummySurvey}).then(async (response) => {
            dummySurvey.id = response.body.id;
            dummySurveyComponent.survey_id = response.body.id;
            await request(app).post('/surveys/' + dummySurvey.id + "/surveyComponents").set('Accept', /json/).send({survey_component: dummySurveyComponent}).then(async (response) => {
              dummySurveyComponent.id = response.body.id;
              dummySurveyItem.survey_component_id = response.body.id;
              await request(app).post('/surveyComponents/' + dummySurveyComponent.id + "/surveyItems").set('Accept', /json/).send({survey_item: dummySurveyItem}).then(async (response) => {
                dummySurveyItem.id = response.body.id;
                dummySurveyItemOptionLabel.survey_item_id = response.body.id;
                await request(app).post('/surveyItems/' + dummySurveyItem.id + "/options").set('Accept', /json/).send({survey_item_option: dummySurveyItemOption}).then((response) => {
                  dummySurveyItemOption.id = response.body.id;
                  dummySurveyItemOptionLabel.survey_item_option_id = response.body.id;
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
  await request(app).delete('/options/' + dummySurveyItemOption.id).then(async () => {
    await request(app).delete('/surveyItems/' + dummySurveyItem.id).then(async () => {
      await request(app).delete('/surveyComponents/' + dummySurveyComponent.id).then(async () => {
        await request(app).delete('/surveys/' + dummySurvey.id).set('Accept', /json/).send({survey: dummySurvey}).then(async () => {
          await request(app).delete('/dataCollections/' + dummyDataCollection.id).set('Accept', /json/).send({data_collection: dummyDataCollection}).then(async () => {
            await request(app).delete('/projects/'+dummyProject.id).then(async () => {
              await request(app).delete('/users/' + adminUser.id).then(async () => {
                await request(app).delete('/roles/'+adminRole.id);
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

describe('Test /options/:id/optionLabels method root path', () => {
  test('Test GET method', (done) => {
    request(app).get('/options/' + dummySurveyItemOption.id + "/optionLabels").then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  test('Test POST method', (done) => {
    request(app).post('/options/' + dummySurveyItemOption.id + "/optionLabels").set('Accept', /json/).send({label_survey_item_option: dummySurveyItemOptionLabel}).then((response) => {
      expect(response.statusCode).toBe(201);
      dummySurveyItemOptionLabel.id = response.body.id;
      done();
    });
  });
  test('Test POST method without data', (done) => {
    request(app).post('/options/' + dummySurveyItemOption.id + "/optionLabels").set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test POST method with incomplete data', (done) => {
    request(app).post('/options/' + dummySurveyItemOption.id + "/optionLabels").set('Accept', /json/).send({label_survey_item_option: dummyIncompleteSurveyItemOptionLabel}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});
describe('Test /surveyItemLabels method root path', () => {
  test('Test GET method with valid id', (done) => {
    request(app).get('/optionLabels/' + dummySurveyItemOptionLabel.id).set('Accept', /json/).send({label_survey_item_option: dummySurveyItemOptionLabel}).then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body[0].id).toBe(dummySurveyItemOptionLabel.id);
      expect(response.body[0].language).toBe(dummySurveyItemOptionLabel.language);
      expect(response.body[0].content).toBe(dummySurveyItemOptionLabel.content);
      expect(response.body[0].survey_item_option_id).toBe(dummySurveyItemOptionLabel.survey_item_option_id);
      done();
    });
  });
  test('Test GET method with invalid id', (done) => {
    request(app).get('/optionLabels/' + invalid_id).set('Accept', /json/).send({label_survey_item_option: dummySurveyItemOptionLabel}).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test GET method with string id', (done) => {
    request(app).get('/optionLabels/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT', (done) => {
    request(app).put('/optionLabels/' + dummySurveyItemOptionLabel.id).set('Accept', /json/).send({label_survey_item_option: dummySurveyItemOptionLabel}).then((response) => {
      expect(response.statusCode).toBe(202);
      expect(response.body[0].id).toBe(dummySurveyItemOptionLabel.id);
      expect(response.body[0].language).toBe(dummySurveyItemOptionLabel.language);
      expect(response.body[0].content).toBe(dummySurveyItemOptionLabel.content);
      expect(response.body[0].survey_item_option_id).toBe(dummySurveyItemOptionLabel.survey_item_option_id);
      done();
    });
  });
  test('Test PUT with incomplete date', (done) => {
    request(app).put('/optionLabels/' + dummySurveyItemOptionLabel.id).set('Accept', /json/).send({label_survey_item_option: dummyIncompleteSurveyItemOptionLabel}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and incomplete data', (done) => {
    request(app).put('/optionLabels/' + invalid_id).set('Accept', /json/).send({label_survey_item_option: dummyIncompleteSurveyItemOptionLabel}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with string id and incomplete data', (done) => {
    request(app).put('/optionLabels/' + string_id).set('Accept', /json/).send({label_survey_item_option: dummyIncompleteSurveyItemOptionLabel}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with invalid id and empty user', (done) => {
    request(app).put('/optionLabels/' + invalid_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test PUT with string id and empty user', (done) => {
    request(app).put('/optionLabels/' + string_id).set('Accept', /json/).send({}).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  test('Test DELETE', (done) => {
    request(app).delete('/optionLabels/' + dummySurveyItemOptionLabel.id).then((response) => {
      expect(response.statusCode).toBe(204);
      done();
    });
  });
  test('Test DELETE with invalid id', (done) => {
    request(app).delete('/optionLabels/' + invalid_id).then((response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });
  test('Test DELETE with string id', (done) => {
    request(app).delete('/optionLabels/' + string_id).then((response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});