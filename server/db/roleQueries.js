/**
 * Role queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getRoles = (request, response) => {
  var project_id = parseInt(request.params.id);

  pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE project_id = ?) ORDER BY id ASC', [project_id], (error, results) => {
    if (error) {
      console.log(err);
      response.status(400).send("Bad Request");
    }
    response.status(200).json(results.rows);
  })
}

const getRoleById = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var role_id = parseInt(request.params.id2);

  if(project_id != undefined && role_id != undefined){
    pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE project_id = ? AND role_id = ?)', [project_id, role_id], (error, results) => {
      if (error) {
        console.log(err);
        response.status(404).send("Role not found");
      }
      response.status(200).json(results.rows)
    })
  }else{
    response.status(400).send("Invalid id");
  }
}

const createRole = (request, response) => {
  const { name, description } = request.body;

  pool.query('INSERT INTO role (name, description) VALUES (\'$1\', \'$2\')', [name, description], (error, results) => {
    if (error) {
      console.log(err);
      response.status(400).send("Bad Request");
    }
    response.status(201).send("Role added with ID: ${result.insertId}");
  })
}

const updateRole = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var role_id = parseInt(request.params.id2);
  const { name, description } = request.body;

  if(project_id != undefined && role_id != undefined){
    pool.query(
      'UPDATE role SET name = \'$1\', description = \'$2\' WHERE id IN (SELECT role_id FROM member WHERE project_id = ? AND role_id = ?)',
      [name, description, project_id, role_id],
      (error, results) => {
        if (error) {
          console.log(err);
          response.status(404).send("Role not found");
        }
        response.status(200).send("Role modified with ID: ${id}");
      }
    )
  }else{
    response.status(400).send("Invalid id");
  }
}

const deleteRole = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var role_id = parseInt(request.params.id2);

  if(project_id != undefined && role_id != undefined){
    pool.query('DELETE FROM role WHERE id IN (SELECT role_id FROM member WHERE project_id = ? AND role_id = ?)', [project_id, role_id], (error, results) => {
      if (error) {
        console.log(err);
        response.status(404).send("Role not found");
      }
      response.status(200).send("Role deleted with ID: ${id}")
    })
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