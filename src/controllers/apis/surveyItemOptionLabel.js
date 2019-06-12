/**
 * SurveyItemOptionLabel APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyItemOptionLabel = require('../../db/surveyItemOptionLabelQueries');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/optionLabels/:id', isLoggedIn, dbSurveyItemOptionLabel.getSurveyOptionLabelById);

  app.put('/optionLabels/:id', isLoggedIn, dbSurveyItemOptionLabel.updateSurveyOptionLabel);

  app.delete('/optionLabels/:id', isLoggedIn, dbSurveyItemOptionLabel.deleteSurveyOptionLabel);

};