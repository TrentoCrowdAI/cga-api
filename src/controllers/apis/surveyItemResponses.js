/**
 * ItemResponses APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyItemResponse = require('../../db/surveyItemResponseQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/itemResponses/:id', isLoggedIn, dbSurveyItemResponse.getSurveyItemResponseById);

  app.put('/itemResponses/:id', isLoggedIn, dbSurveyItemResponse.updateSurveyItemResponse);

  app.delete('/itemResponses/:id', isLoggedIn, dbSurveyItemResponse.deleteSurveyItemResponse);

};
