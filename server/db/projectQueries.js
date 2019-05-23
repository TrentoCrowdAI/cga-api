/**
 * Project queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})

const getProjects = (request, response) => {
  pool.query('SELECT * FROM project ORDER BY id ASC', (error, results) => {
    if (error) {
      response.status(400).send("Bad Request");
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

const getProjectById = (request, response) => {
  var id = parseInt(request.params.id)
  if(id != undefined){
    pool.query('SELECT * FROM project WHERE id = $1', [id], (error, results) => {
      if (error) {
        response.status(404).send("Project not found");
        throw error;
      }
      response.status(200).json(results.rows)
    })
  }else{
    response.status(400).send("Invalid id");
  }
}

const createProject = (request, response) => {
  const { name, description, creation_date } = request.body;

  pool.query('INSERT INTO project (name, description, creation_date) VALUES (\'$1\', \'$2\', $3)', [name, description, creation_date ], (error, results) => {
    if (error) {
      response.status(400).send("Bad Request");
      throw error;
    }
    response.status(201).send(`Project added with ID: ${result.insertId}`);
  })
}

const updateProject = (request, response) => {
  var id = parseInt(request.params.id)
  const { name, description, creation_date } = request.body;

  if(id != undefined){
    pool.query(
      'UPDATE project SET name = \'$1\', description = \'$2\', creation_date = $3 WHERE id = $5',
      [name, description, creation_date, id],
      (error, results) => {
        if (error) {
          response.status(404).send("Project not found");
          throw error
        }
        response.status(200).send(`Project modified with ID: ${id}`);
      }
    )
  }else{
    response.status(400).send("Invalid id");
  }
}

const deleteProject = (request, response) => {
  const id = parseInt(request.params.id);
  if(id != undefined){
    pool.query('DELETE FROM project WHERE id = $1', [id], (error, results) => {
      if (error) {
        response.status(404).send("Project not found");
        throw error
      }
      response.status(200).send(`Project deleted with ID: ${id}`)
    })
  }else{
    response.status(400).send("Invalid id");
  }
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};