/**
 * SurveyItemLabel APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyItemOption = require('../../db/surveyItemOptionQueries.js');
const dbSurveyItemOptionLabel = require('../../db/surveyItemOptionLabelQueries');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/options/:id', isLoggedIn, dbSurveyItemOption.getSurveyItemOptionById);

  app.put('/options/:id', isLoggedIn, dbSurveyItemOption.updateSurveyItemOption);

  app.delete('/options/:id', isLoggedIn, dbSurveyItemOption.deleteSurveyItemOption);

  app.get('/options/:id/optionLabels', isLoggedIn, dbSurveyItemOptionLabel.getSurveyOptionLabels);

  app.post('/options/:id/optionLabels', isLoggedIn, dbSurveyItemOptionLabel.createSurveyOptionLabel);

};