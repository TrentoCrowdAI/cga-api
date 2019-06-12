/**
 * SurveyItem APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyItem = require('../../db/surveyItemQueries.js');
const dbSurveyItemLabel = require('../../db/surveyItemLabelQueries.js');
const dbSurveyItemOption = require('../../db/surveyItemOptionQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/surveyItems/:id', isLoggedIn, dbSurveyItem.getSurveyItemById);

  app.put('/surveyItems/:id', isLoggedIn, dbSurveyItem.updateSurveyItem);

  app.delete('/surveyItems/:id', isLoggedIn, dbSurveyItem.deleteSurveyItem);

  app.get('/surveyItems/:id/labels', isLoggedIn, dbSurveyItemLabel.getSurveyItemLabels);

  app.post('/surveyItems/:id/labels', isLoggedIn, dbSurveyItemLabel.createSurveyItemLabel);

  app.get('/surveyItems/:id/options', isLoggedIn, dbSurveyItemOption.getSurveyItemOptions);

  app.post('/surveyItems/:id/options', isLoggedIn, dbSurveyItemOption.createSurveyItemOption);

};
