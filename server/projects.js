/**
 * Project APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbProject = require('./db/projectQueries');
const dbMember = require('./db/memberQueries');
//const {isLoggedIn} = require('./server');

// Make sure that the request is sent by an authorized user
const isLoggedIn = (req, res, next) => {
  console.log(req.session);
  if (req.session && req.session.user !== undefined) {
    next();
  } else {
    res.status(400).json('User not authenticated');
  }
} 

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
  
};