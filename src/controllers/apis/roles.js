/**
 * Role APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbRole = require('../../db/roleQueries.js');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('roles/', isLoggedIn, dbRole.getRoles);

  app.post('roles/', isLoggedIn, dbRole.createRole);

  app.get('/roles/:id', isLoggedIn, dbRole.getRoleById);

  app.put('/roles/:id', isLoggedIn, dbRole.updateRole);

  app.delete('/roles/:id', isLoggedIn, dbRole.deleteRole);

};
  