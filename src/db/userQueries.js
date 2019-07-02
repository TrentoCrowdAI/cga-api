/**
 * Users queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;
var Cookies = require('cookies');

const createUser = (request, response) => {
  if(request.session.user != null && request.session.user.name != null && request.session.user.surname != null){ 
    const { id, name, surname, avatar } = request.session.user;
    pool.query('SELECT * FROM "user" WHERE id = $1', 
      [id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }
        if(results.rowCount == 0){
          pool.query('INSERT INTO "user" (id, name, surname, avatar) VALUES ($1, $2, $3, $4) RETURNING *', 
            [id, name, surname, avatar], (error, results) => {
              if (error) {
                console.log(error);
                response.status(500).send("Internal Server Error");
              }else{
                if(process.env.NODE_ENV === 'test'){
                  response.status(201).json({"user": results.rows[0]});
                }else{
                  var cookies = new Cookies(request, response);
                  var expressSessionCookie = cookies.get('express:sess');
                  var expressSessionSignatureCookie = cookies.get('express:sess.sig');
                  results.rows[0].expressSessionCookie = expressSessionCookie;
                  results.rows[0].expressSessionSignatureCookie = expressSessionSignatureCookie;
                  response.redirect("OAuthLogin://login?user=" + JSON.stringify(results.rows[0]));
                }
              }
            }
          );
        }else{
          if(process.env.NODE_ENV === 'test'){
            response.status(200).json({"user": results.rows[0]});
          }else{
            var cookies = new Cookies(request, response);
            var expressSessionCookie = cookies.get('express:sess');
            var expressSessionSignatureCookie = cookies.get('express:sess.sig');
            results.rows[0].expressSessionCookie = expressSessionCookie;
            results.rows[0].expressSessionSignatureCookie = expressSessionSignatureCookie;
            response.redirect("OAuthLogin://login?user=" + JSON.stringify(results.rows[0]));
          }
        }
      }
    );
  }else{
    response.status(400).send("Bad Request");
  }
}

const getUsers = (request, response) => {
  pool.query('SELECT * FROM "user" ORDER BY id ASC', (error, results) => {
    if (error) {
      console.log(error);
      response.status(500).send("Internal server error");
    }else{
      response.status(200).json(results.rows);
    }
  })
}

const getUserById = (request, response) => {
  var id = request.params.id;
  var isNumber =  /^\d+$/.test(id);
  if(id != null && isNumber){
    pool.query('SELECT * FROM "user" WHERE id = $1', 
      [id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal server error");
        }else if(results.rowCount == 0){
          response.status(404).send("User not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const updateUser = (request, response) => {
  var id = request.params.id;
  var isNumber =  /^\d+$/.test(id);
  if(id != null && isNumber){
    if(request.body.user != null && request.body.user.name != null && request.body.user.surname != null && request.body.user.avatar != null){
      const { name, surname, avatar } = request.body.user;
      pool.query(
        'UPDATE "user" SET name = $1, surname = $2, avatar = $3 WHERE id = $4 RETURNING *',
        [name, surname, avatar, id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            response.status(404).send("User not found");
          }else{
            response.status(202).send(results.rows);
          }
        }
      );
    }else{
      response.status(400).send("Bad Request");
    }
  }else{
    response.status(400).send("Invalid id");
  }
}

const deleteUser = (request, response) => {
  var id = request.params.id;
  var isNumber =  /^\d+$/.test(id);
  if(id != null && isNumber){
    pool.query('DELETE FROM "user" WHERE id = $1', 
      [id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("User not found");
        }else{
          response.status(204).send("User deleted with ID: " + id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};