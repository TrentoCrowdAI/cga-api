/**
 * Project APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbProject = require('../../db/projectQueries');
const dbMember = require('../../db/memberQueries');
const dbRole = require('../../db/roleQueries');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/projects', isLoggedIn, dbProject.getProjects);

  app.post('/projects', isLoggedIn, dbProject.createProject);

  app.get('/projects/:id', isLoggedIn, dbProject.getProjectById);

  app.post('/projects/:id', isLoggedIn, dbProject.updateProject);

  app.delete('/projects/:id', isLoggedIn, dbProject.deleteProject);

  app.get('/projects/:id/members', isLoggedIn, dbMember.getMembers);

  app.post('/projects/:id1/members/:id2', isLoggedIn, dbMember.createMember); //it's ok???

  app.get('/projects/:id1/members/:id2', isLoggedIn, dbMember.getMemberById);

  app.post('/projects/:id1/members/:id2', isLoggedIn, dbMember.updateMember);

  app.delete('/projects/:id1/members/:id2', isLoggedIn, dbMember.deleteMember);

  app.get('/projects/:id/roles', isLoggedIn, dbRole.getRoles);

  app.post('/projects/:id1/roles/:id2', isLoggedIn, dbRole.createRole);

  app.get('/projects/:id1/roles/:id2', isLoggedIn, dbRole.getRoleById);

  app.post('/projects/:id1/roles/:id2', isLoggedIn, dbRole.updateRole);

  app.delete('/projects/:id1/roles/:id2', isLoggedIn, dbRole.deleteRole);
};