/**
 * Subject APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbSubject = require('../../db/subjectQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/subjects', isLoggedIn, dbSubject.getSubjects);

  app.post('/subjects', isLoggedIn, dbSubject.createSubject);

  app.get('/subjects/:id', isLoggedIn, dbSubject.getSubjectById);

  app.put('/subjects/:id', isLoggedIn, dbSubject.updateSubject);

  app.delete('/subjects/:id', isLoggedIn, dbSubject.deleteSubject);
};