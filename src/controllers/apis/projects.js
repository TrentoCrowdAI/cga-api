/**
 * Project APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbProject = require('../../db/projectQueries.js');
const dbMember = require('../../db/memberQueries.js');
const dbDataCollection = require('../../db/dataCollectionQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;
const isLoggedInWithAdminCheck = require('../../utilities.js').isLoggedInWithAdminCheck;

exports.init = function (app) {

  app.get('/projects', isLoggedIn, dbProject.getProjects);

  app.post('/projects', isLoggedIn, dbProject.createProject);

  app.get('/projects/:id', isLoggedIn, dbProject.getProjectById);

  app.put('/projects/:id', isLoggedInWithAdminCheck, dbProject.updateProject);

  app.delete('/projects/:id', isLoggedInWithAdminCheck, dbProject.deleteProject);

  app.post('/projects/:id/dataCollections', isLoggedInWithAdminCheck, dbDataCollection.createDataCollection);

  app.get('/projects/:id/dataCollections', isLoggedIn, dbDataCollection.getProjectDataCollections)

  app.get('/projects/:id/members', isLoggedIn, dbMember.getProjectMembers);

  app.post('/projects/:id/members', isLoggedInWithAdminCheck, dbMember.addMember);

  app.get('/projects/:id1/members/:id2', isLoggedIn, dbMember.getMemberById); 

  app.put('/projects/:id1/members/:id2', isLoggedInWithAdminCheck, dbMember.updateMember);

  app.delete('/projects/:id1/members/:id2', isLoggedInWithAdminCheck, dbMember.deleteMember);

};