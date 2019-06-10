/**
 * Role queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getRoles = (request, response) => {
  pool.query('SELECT * FROM role ORDER BY id ASC', 
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
      }else{ 
        response.status(200).json(results.rows);
      }
    }
  );
}

const getRoleById = (request, response) => {
  var role_id = parseInt(request.params.id);

  if(role_id != undefined && !isNaN(role_id)){
    pool.query('SELECT * FROM role WHERE id = $1', 
      [role_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("Role not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const createRole = (request, response) => {
  if(request.body.role != null && request.body.role.id != null && request.body.role.name != null && request.body.role.description != null){
    const { id, name, description } = request.body.role;
    pool.query('INSERT INTO role (id, name, description) VALUES ($1, $2, $3) RETURNING id', 
      [id, name, description], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount != 0){ 
          response.status(201).send({id: results.rows[0].id});
        }
      }
    );
  }else{
    response.status(400).send("Bad Request");
  }
}

const updateRole = (request, response) => {
  var role_id = parseInt(request.params.id);

  if(role_id != undefined && !isNaN(role_id)){
    if(request.body.role != null && request.body.role.name != null && request.body.role.description != null){
      const { name, description } = request.body.role;  
      pool.query('UPDATE role SET name = $1, description = $2 WHERE id = $3 RETURNING *',
        [name, description, role_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){ 
            response.status(404).send("Role not found");
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

const deleteRole = (request, response) => {
  var role_id = parseInt(request.params.id);

  if(role_id != undefined && !isNaN(role_id)){
    pool.query('DELETE FROM role WHERE id = $1', 
      [role_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("Role not found");
        }else{
          response.status(204).send({id: role_id});
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};