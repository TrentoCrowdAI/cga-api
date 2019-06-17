/**
 * Users queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const createUser = (request, response) => {
  if(request.session.user != null && request.session.user.name != null && request.session.user.surname != null){ 
    const { id, name, surname } = request.session.user;
    pool.query('SELECT * FROM "user" WHERE id = $1', 
      [id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }
        if(results.rowCount == 0){
          pool.query('INSERT INTO "user" (id, name, surname) VALUES ($1, $2, $3)', 
            [id, name, surname], (error, results) => {
              if (error) {
                console.log(error);
                response.status(500).send("Internal Server Error");
              }else{
                if(process.env.NODE_ENV === 'test'){
                  response.status(201).json({"id": id});
                }
                response.redirect("OAuthLogin://login?user=${JSON.stringify(req.session.user)}");//comment for test
              }
            }
          );
        }else{
          if(process.env.NODE_ENV === 'test'){
            response.status(200).json(results.rows);
          }
          response.redirect("OAuthLogin://login?user=${JSON.stringify(req.session.user)}");//comment for test
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
    if(request.body.user != null && request.body.user.name != null && request.body.user.surname != null){
      const { name, surname } = request.body.user;
      pool.query(
        'UPDATE "user" SET name = $1, surname = $2 WHERE id = $3 RETURNING *',
        [name, surname, id], (error, results) => {
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