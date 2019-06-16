/**
 * ItemResponses APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyItemResponse = require('../../db/surveyItemResponseQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/surveyItemResponses/:id', isLoggedIn, dbSurveyItemResponse.getSurveyItemResponseById);

  app.put('/surveyItemResponses/:id', isLoggedIn, dbSurveyItemResponse.updateSurveyItemResponse);

  app.delete('/surveyItemResponses/:id', isLoggedIn, dbSurveyItemResponse.deleteSurveyItemResponse);

};
