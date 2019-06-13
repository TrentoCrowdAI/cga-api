/**
 * SurveyItemOptionLabel APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyItemOptionLabel = require('../../db/surveyItemOptionLabelQueries');
const isLoggedIn = require('../../utilities.js').isLoggedIn;
const isLoggedInWithAdminCheck = require('../../utilities.js').isLoggedInWithAdminCheck;

exports.init = function (app) {

  app.get('/optionLabels/:id', isLoggedIn, dbSurveyItemOptionLabel.getSurveyOptionLabelById);

  app.put('/optionLabels/:id', isLoggedInWithAdminCheck, dbSurveyItemOptionLabel.updateSurveyOptionLabel);

  app.delete('/optionLabels/:id', isLoggedInWithAdminCheck, dbSurveyItemOptionLabel.deleteSurveyOptionLabel);

};