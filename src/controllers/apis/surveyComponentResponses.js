/**
 * ComponentResponses APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyComponentResponse = require('../../db/surveyComponentResponseQueries.js');
const dbSurveyItemResponse = require('../../db/surveyItemResponseQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) { //assign the subject that is part of a survey to a user

  app.get('/componentResponses/:id', isLoggedIn, dbSurveyComponentResponse.getSurveyComponentResponseById);

  app.put('/componentResponses/:id', isLoggedIn, dbSurveyComponentResponse.updateSurveyComponentResponse);

  app.delete('/componentResponses/:id', isLoggedIn, dbSurveyComponentResponse.deleteSurveyComponentResponse);

  app.get('/componentResponses/:id/surveyItemResponses', isLoggedIn, dbSurveyItemResponse.getSurveyItemResponses);

  app.post('/componentResponses/:id/surveyItemResponses', isLoggedIn, dbSurveyItemResponse.createSurveyItemResponse);

};
