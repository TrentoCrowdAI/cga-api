/**
 * Survey APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurvey = require('../../db/surveyQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/surveys/:id', isLoggedIn, dbSurvey.getSurveyById);

  app.put('/surveys/:id', isLoggedIn, dbSurvey.updateSurvey);

  app.delete('/surveys/:id', isLoggedIn, dbSurvey.deleteSurvey);

};
