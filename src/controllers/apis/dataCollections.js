/**
 * Project APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbDataCollection = require('../../db/dataCollectionQueries.js');
const dbSurvey = require('../../db/surveyQueries.js'); 
const isLoggedIn = require('../../utilities.js').isLoggedIn;
const isLoggedInWithAdminCheck = require('../../utilities.js').isLoggedInWithAdminCheck;

exports.init = function (app) {

  app.get('/dataCollections/:id', isLoggedIn, dbDataCollection.getDataCollectionById);

  app.put('/dataCollections/:id', isLoggedInWithAdminCheck, dbDataCollection.updateDataCollection);

  app.delete('/dataCollections/:id', isLoggedInWithAdminCheck, dbDataCollection.deleteDataCollection);

  app.get('/dataCollections/:id/surveys', isLoggedIn, dbSurvey.getSurveys);

  app.post('/dataCollections/:id/surveys', isLoggedInWithAdminCheck, dbSurvey.createSurvey);

};