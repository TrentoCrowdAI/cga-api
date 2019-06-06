/**
 * Member APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */
const dbMember = require('../../db/memberQueries.js');
const dataCollectionRoleDB = require('../../db/collectionRoleQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {
  app.get('/members/:id', isLoggedIn, dbMember.getMemberById); //sistemare id

  app.put('/members/:id', isLoggedIn, dbMember.updateMember);//sistemare id

  app.delete('/members/:id', isLoggedIn, dbMember.deleteMember); //sistemare id

  app.get('/members/:id/roles/', isLoggedIn, dataCollectionRoleDB.getProjectCollectionRoles); //sistemare id

  app.get('/members/:id1/roles/:id2', isLoggedIn, dataCollectionRoleDB.getCollectionRoleById); //sistemare id

  app.post('/members/:id1/roles/:id2', isLoggedIn, dataCollectionRoleDB.assignCollectionRole);//sistemare id

  app.put('/members/:id1/roles/:id2', isLoggedIn, dataCollectionRoleDB.updateCollectionRole);//sistemare id

  app.delete('/members/:id1/roles/:id2', isLoggedIn, dataCollectionRoleDB.deleteCollectionRole);//sistemare id

};