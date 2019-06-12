/**
 * SurveyItem APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyItem = require('../../db/surveyItemQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/surveyItems/:id', isLoggedIn, dbSurveyItem.getSurveyItemById);

  app.put('/surveyItems/:id', isLoggedIn, dbSurveyItem.updateSurveyItem);

  app.delete('/surveyItems/:id', isLoggedIn, dbSurveyItem.deleteSurveyItem);

};
