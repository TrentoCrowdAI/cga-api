/**
 * Users APIs
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const dbUser = require('./db/userQueries');
//const isLoggedIn = require('./server');

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

  app.get('/users', isLoggedIn, dbUser.getUsers);

  app.post('/users', isLoggedIn, dbUser.createUser);

  app.get('/users/:id', isLoggedIn, dbUser.getUserById);

  app.post('/users/:id', isLoggedIn, dbUser.updateUser);

  app.delete('/users/:id', isLoggedIn, dbUser.deleteUser);

};
