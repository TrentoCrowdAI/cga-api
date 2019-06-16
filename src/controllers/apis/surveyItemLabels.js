/**
 * SurveyItemLabel APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyItemLabel = require('../../db/surveyItemLabelQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;
const isLoggedInWithAdminCheck = require('../../utilities.js').isLoggedInWithAdminCheck;

exports.init = function (app) {

  app.get('/labels/:id', isLoggedIn, dbSurveyItemLabel.getSurveyItemLabelById);

  app.put('/labels/:id', isLoggedInWithAdminCheck, dbSurveyItemLabel.updateSurveyItemLabel);

  app.delete('/labels/:id', isLoggedInWithAdminCheck, dbSurveyItemLabel.deleteSurveyItemLabel);

};