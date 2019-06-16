/**
 * SurveyItemLabel APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyItemOption = require('../../db/surveyItemOptionQueries.js');
const dbSurveyItemOptionLabel = require('../../db/surveyItemOptionLabelQueries');
const isLoggedIn = require('../../utilities.js').isLoggedIn;
const isLoggedInWithAdminCheck = require('../../utilities.js').isLoggedInWithAdminCheck;

exports.init = function (app) {

  app.get('/options/:id', isLoggedIn, dbSurveyItemOption.getSurveyItemOptionById);

  app.put('/options/:id', isLoggedInWithAdminCheck, dbSurveyItemOption.updateSurveyItemOption);

  app.delete('/options/:id', isLoggedInWithAdminCheck, dbSurveyItemOption.deleteSurveyItemOption);

  app.get('/options/:id/optionLabels', isLoggedIn, dbSurveyItemOptionLabel.getSurveyOptionLabels);

  app.post('/options/:id/optionLabels', isLoggedInWithAdminCheck, dbSurveyItemOptionLabel.createSurveyOptionLabel);

};