/**
 * SurveyComponent APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyComponent = require('../../db/surveyComponentQueries.js');
const dbSurveyItem = require('../../db/surveyItemQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;
const isLoggedInWithAdminCheck = require('../../utilities.js').isLoggedInWithAdminCheck;

exports.init = function (app) {

  app.get('/surveyComponents/:id', isLoggedIn, dbSurveyComponent.getSurveyComponentById);

  app.put('/surveyComponents/:id', isLoggedInWithAdminCheck, dbSurveyComponent.updateSurveyComponent);

  app.delete('/surveyComponents/:id', isLoggedInWithAdminCheck, dbSurveyComponent.deleteSurveyComponent);

  app.get('/surveyComponents/:id/surveyItems', isLoggedIn, dbSurveyItem.getSurveyItems);

  app.post('/surveyComponents/:id/surveyItems', isLoggedInWithAdminCheck, dbSurveyItem.createSurveyItem);

};
