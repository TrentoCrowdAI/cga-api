/**
 * Cga backend server
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

var express = require('express');

var app = express();
// set as static folder "public" on the root
app.use(express.static('public'))

// Initialising the APIs
var users = require("./users");
var projects = require("./projects");
users.init(app);
projects.init(app);

// starting the server
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Cga backend server listening at http://localhost:' + port);
