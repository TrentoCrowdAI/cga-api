/**
 * Survey APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurvey = require('../../db/surveyQueries.js');
const dbSurveyResponse = require('../../db/surveyResponseQueries.js');
const dbSurveyComponent = require('../../db/surveyComponentQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;
const isLoggedInWithAdminCheck = require('../../utilities.js').isLoggedInWithAdminCheck;

exports.init = function (app) {

  app.get('/surveys/:id', isLoggedIn, dbSurvey.getSurveyById);

  app.put('/surveys/:id', isLoggedInWithAdminCheck, dbSurvey.updateSurvey);

  app.delete('/surveys/:id', isLoggedInWithAdminCheck, dbSurvey.deleteSurvey);

  app.get('/surveys/:id/subjects', isLoggedIn, dbSurveyResponse.getSurveySubjects);

  app.post('/surveys/:id/subjects', isLoggedInWithAdminCheck, dbSurveyResponse.addSubjectToSurvey);

  app.get('/surveys/:id/responses', isLoggedIn, dbSurveyResponse.getSurveyResponses);

  app.get('/surveys/:id/surveyComponents', isLoggedIn, dbSurveyResponse.getSurveyResponses);

  app.post('/surveys/:id/surveyComponents', isLoggedInWithAdminCheck, dbSurveyComponent.createSurveyComponent);

};
