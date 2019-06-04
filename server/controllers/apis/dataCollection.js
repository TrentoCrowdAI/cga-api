/**
 * Project APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbDataCollection = require('../../db/dataCollectionQueries.js');
const dbSurvey = require('../../db/surveyQueries.js'); 
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/dataCollections/:id', isLoggedIn, dbDataCollection.getDataCollectionById_dataCollection);

  app.put('/dataCollections/:id', isLoggedIn, dbDataCollection.updateDataCollection_dataCollection);

  app.delete('/dataCollections/:id', isLoggedIn, dbDataCollection.deleteDataCollection_dataCollection);

  app.get('/dataCollections/:id/surveys', isLoggedIn, dbSurvey.getSurveys);

  app.post('/dataCollections/:id/surveys', isLoggedIn, dbSurvey.createSurvey);

};