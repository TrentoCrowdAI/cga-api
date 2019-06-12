/**
 * SurveyComponent APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyComponent = require('../../db/surveyComponentQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/surveyComponents/:id', isLoggedIn, dbSurveyComponent.getSurveyComponentById);

  app.put('/surveyComponents/:id', isLoggedIn, dbSurveyComponent.updateSurveyComponent);

  app.delete('/surveyComponents/:id', isLoggedIn, dbSurveyComponent.deleteSurveyComponent);

};
