/**
 * Project APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbProject = require('./db/projectQueries');
const dbMember = require('./db/memberQueries');

exports.init = function (app) {

  app.get('/projects', dbProject.getProjects);

  app.post('/projects', dbProject.createProject);

  app.get('/projects/:id', dbProject.getProjectById);

  app.post('/projects/:id', dbProject.updateProject);

  app.delete('/projects/:id', dbProject.deleteProject);

  app.get('/projects/:id/members', dbMember.getMembers);

  app.post('/projects/:id1/members/:id2', dbMember.createMember); //it's ok???

  app.get('/projects/:id1/members/:id2', dbMember.getMemberById);

  app.post('/projects/:id1/members/:id2', dbMember.updateMember);

  app.delete('/projects/:id1/members/:id2', dbMember.deleteMember);
  
};