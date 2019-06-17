/**
 * SurveyItem APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyItem = require('../../db/surveyItemQueries.js');
const dbSurveyItemLabel = require('../../db/surveyItemLabelQueries.js');
const dbSurveyItemImage = require('../../db/surveyItemImageQueries.js');
const dbSurveyItemOption = require('../../db/surveyItemOptionQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;
const isLoggedInWithAdminCheck = require('../../utilities.js').isLoggedInWithAdminCheck;

exports.init = function (app) {

  app.get('/surveyItems/:id', isLoggedIn, dbSurveyItem.getSurveyItemById);

  app.put('/surveyItems/:id', isLoggedInWithAdminCheck, dbSurveyItem.updateSurveyItem);

  app.delete('/surveyItems/:id', isLoggedInWithAdminCheck, dbSurveyItem.deleteSurveyItem);

  app.get('/surveyItems/:id/labels', isLoggedIn, dbSurveyItemLabel.getSurveyItemLabels);

  app.post('/surveyItems/:id/labels', isLoggedInWithAdminCheck, dbSurveyItemLabel.createSurveyItemLabel);

  app.get('/surveyItems/:id/images', isLoggedIn, dbSurveyItemImage.getSurveyItemImages);

  app.post('/surveyItems/:id/images', isLoggedInWithAdminCheck, dbSurveyItemImage.createSurveyItemImage);

  app.get('/surveyItems/:id/options', isLoggedIn, dbSurveyItemOption.getSurveyItemOptions);

  app.post('/surveyItems/:id/options', isLoggedInWithAdminCheck, dbSurveyItemOption.createSurveyItemOption);

};
