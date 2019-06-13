/**
 * ComponentResponses APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyComponentResponse = require('../../db/surveyComponentResponseQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/componentResponses/:id', isLoggedIn, dbSurveyComponentResponse.getSurveyComponentResponseById);

  app.put('/componentResponses/:id', isLoggedIn, dbSurveyComponentResponse.updateSurveyComponentResponse);

  app.delete('/componentResponses/:id', isLoggedIn, dbSurveyComponentResponse.deleteSurveyComponentResponse);

};
