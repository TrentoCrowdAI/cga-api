/**
 * Users APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbUser = require('./db/userQueries');

exports.init = function (app) {

  app.get('/users', dbUser.getUsers);

  app.post('/users', dbUser.createUser);

  app.get('/users/:id', dbUser.getUserById);

  app.post('/users/:id', dbUser.updateUser);

  app.delete('/users/:id', dbUser.deleteUser);

};
