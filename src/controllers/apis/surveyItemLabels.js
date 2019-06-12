/**
 * SurveyItemLabel APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyItemLabel = require('../../db/surveyItemLabelQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/labels/:id', isLoggedIn, dbSurveyItemLabel.getSurveyItemLabelById);

  app.put('/labels/:id', isLoggedIn, dbSurveyItemLabel.updateSurveyItemLabel);

  app.delete('/labels/:id', isLoggedIn, dbSurveyItemLabel.deleteSurveyItemLabel);

};