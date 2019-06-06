/**
 * Users queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const createUser = (request, response) => {
  const { id, name, surname } = request.session.user;
  pool.query('SELECT * FROM "user" WHERE id = $1', 
    [id], (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
      }
      if(results != undefined && results.rowCount == 0){
        pool.query('INSERT INTO "user" (id, name, surname) VALUES ($1, $2, $3)', 
          [id, name, surname], (error, results) => {
            if (error) {
              console.log(error);
              response.status(500).send("Internal Server Error");
            }else{
              response.status(201).send("User added with ID: " + id);
            }
          }
        );
      }else{
        response.status(200).json(results.rows);
      }
    }
  );
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
  if(id != undefined){
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
  const { name, surname } = request.body.user;

  if(id != undefined){
    pool.query(
      'UPDATE "user" SET name = $1, surname = $2, email = $3, password = $4 WHERE id = $5',
      [name, surname, email, password, id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("User not found");
        }else{
          response.status(202).send("User modified with ID: " + id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const deleteUser = (request, response) => {
  const id = request.params.id;
  if(id != undefined){
    pool.query(
      'DELETE FROM "user" WHERE id = $1', [id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("User not found");
        }else{
          response.status(200).send("User deleted with ID: " + id);
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