/**
 * SurveyItemImage APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSurveyItemImage = require('../../db/surveyItemImageQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;
const isLoggedInWithAdminCheck = require('../../utilities.js').isLoggedInWithAdminCheck;

exports.init = function (app) {

  app.get('/images/:id', isLoggedIn, dbSurveyItemImage.getSurveyItemImageById);

  app.put('/images/:id', isLoggedInWithAdminCheck, dbSurveyItemImage.updateSurveyItemImage);

  app.delete('/images/:id', isLoggedInWithAdminCheck, dbSurveyItemImage.deleteSurveyItemImage);

};