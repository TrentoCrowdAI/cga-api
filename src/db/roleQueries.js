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
      }else if(results.rowCount != 0){ 
        response.status(200).json(results.rows);
      }
    }
  );
}

const getProjectRoles = (request, response) => {
  var project_id = parseInt(request.params.id);

  if(project_id != undefined){
    pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE project_id = ?) ORDER BY id ASC', 
      [project_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount != 0){
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const getRoleById = (request, response) => {
  var role_id = parseInt(request.params.id);

  if(role_id != undefined){
    pool.query('SELECT * FROM role WHERE id = ?', 
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
  const { name, description } = request.body.role;

  pool.query('INSERT INTO role (name, description) VALUES (\'$1\', \'$2\') RETURNING id', 
    [name, description], (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
      }else if(results.rowCount != 0){ 
        response.status(201).send("Role added with ID: " + results.rows[0].id);
      }
    }
  );
}

const updateRole = (request, response) => {
  var role_id = parseInt(request.params.id);
  const { name, description } = request.body.role;

  if(role_id != undefined){
    pool.query('UPDATE role SET name = \'$1\', description = \'$2\' WHERE id = ?',
      [name, description, role_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){ 
          response.status(404).send("Role not found");
        }else{
          response.status(200).send("Role modified with ID: " + role_id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const deleteRole = (request, response) => {
  var role_id = parseInt(request.params.id);

  if(role_id != undefined){
    pool.query('DELETE FROM role WHERE id = ?', 
      [role_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("Role not found");
        }else{
          response.status(200).send("Role deleted with ID: " + role_id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

module.exports = {
  getRoles,
  getProjectRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};