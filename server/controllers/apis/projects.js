/**
 * Project APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbProject = require('../../db/projectQueries.js');
const dbMember = require('../../db/memberQueries.js');
const dbRole = require('../../db/roleQueries.js');
const dbDataCollection = require('../../db/dataCollectionQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/projects', isLoggedIn, dbProject.getProjects);

  app.post('/projects', isLoggedIn, dbProject.createProject);

  app.get('/projects/:id', isLoggedIn, dbProject.getProjectById);

  app.put('/projects/:id', isLoggedIn, dbProject.updateProject);

  app.delete('/projects/:id', isLoggedIn, dbProject.deleteProject);

  app.post('project/:id/dataCollections', isLoggedIn, dbDataCollection.createDataCollection);

  app.get('project/:id/dataCollections', isLoggedIn, dbDataCollection.getDataCollections)

  app.get('/projects/:id/members', isLoggedIn, dbMember.getMembers);

  app.post('/projects/:id1/members', isLoggedIn, dbMember.createMember);

  app.get('/projects/:id1/members/:id2', isLoggedIn, dbMember.getMemberById);

  app.put('/projects/:id1/members/:id2', isLoggedIn, dbMember.updateMember);

  app.delete('/projects/:id1/members/:id2', isLoggedIn, dbMember.deleteMember);

  app.get('/projects/:id/roles', isLoggedIn, dbRole.getRoles);

  app.post('/projects/:id1/roles/:id2', isLoggedIn, dbRole.createRole);

  app.get('/projects/:id1/roles/:id2', isLoggedIn, dbRole.getRoleById);

  app.put('/projects/:id1/roles/:id2', isLoggedIn, dbRole.updateRole);

  app.delete('/projects/:id1/roles/:id2', isLoggedIn, dbRole.deleteRole);
};