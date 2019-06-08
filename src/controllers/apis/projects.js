/**
 * Project APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbProject = require('../../db/projectQueries.js');
const dbMember = require('../../db/memberQueries.js');
const dbDataCollection = require('../../db/dataCollectionQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/projects', isLoggedIn, dbProject.getProjects);

  app.post('/projects', isLoggedIn, dbProject.createProject);

  app.get('/projects/:id', isLoggedIn, dbProject.getProjectById);

  app.put('/projects/:id', isLoggedIn, dbProject.updateProject);

  app.delete('/projects/:id', isLoggedIn, dbProject.deleteProject);

  app.post('/projects/:id/dataCollections', isLoggedIn, dbDataCollection.createDataCollection);

  app.get('/projects/:id/dataCollections', isLoggedIn, dbDataCollection.getProjectDataCollections)

  app.get('/projects/:id/members', isLoggedIn, dbMember.getMembers);

  app.post('/projects/:id/members', isLoggedIn, dbMember.createMember);
};