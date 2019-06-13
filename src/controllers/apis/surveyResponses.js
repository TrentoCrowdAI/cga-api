/**
 * Responses APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyResponse = require('../../db/surveyResponseQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/responses/:id', isLoggedIn, dbSurveyResponse.getSurveyResponseById);

  app.put('/responses/:id', isLoggedIn, dbSurveyResponse.updateSurveyResponse);

  app.delete('/responses/:id', isLoggedIn, dbSurveyResponse.deleteSurveyResponse);

};
