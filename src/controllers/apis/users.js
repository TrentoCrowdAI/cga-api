/**
 * Users APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbUser = require('../../db/userQueries');
const isLoggedIn = require('../../utilities.js').isLoggedIn;

exports.init = function (app) {

  app.get('/users', isLoggedIn, dbUser.getUsers);

  app.post('/users', isLoggedIn, dbUser.createUser);

  app.get('/users/:id', isLoggedIn, dbUser.getUserById);

  app.put('/users/:id', isLoggedIn, dbUser.updateUser);

  app.delete('/users/:id', isLoggedIn, dbUser.deleteUser);

};
