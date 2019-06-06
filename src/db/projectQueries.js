/**
 * Project queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getProjects = (request, response) => {
  pool.query('SELECT * FROM project ORDER BY id ASC', 
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(400).send("Bad Request");
      }else{
        response.status(200).json(results.rows);
      }
    }
  );
}

const getProjectById = (request, response) => {
  var id = parseInt(request.params.id)
  if(id != undefined){
    pool.query('SELECT * FROM project WHERE id = $1', 
      [id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results != null && results.rowCount == 0){
          response.status(404).send("Project not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const createProject = (request, response) => {
  const { name, description, creationDate } = request.body.project;

  if(name != undefined && description != undefined && creationDate != undefined){
    pool.query('INSERT INTO project (name, description, creation_date) VALUES ($1, $2, $3)', 
      [name, description, creationDate ], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount != 0){
          response.status(201).send("Project added with ID: " + id);
        }
      }
    );
  }else{
    response.status(400).send("Bad Request");
  }
}

const updateProject = (request, response) => {
  var id = parseInt(request.params.id)
  const { name, description, creationDate } = request.body.project;

  if(id != undefined){
    pool.query('UPDATE project SET name = \'$1\', description = \'$2\', creation_date = $3 WHERE id = $5',
      [name, description, creationDate, id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("Project not found");
        }else{
          response.status(200).json("Project modified with ID: " + id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const deleteProject = (request, response) => {
  const id = parseInt(request.params.id);
  if(id != undefined){
    pool.query('DELETE FROM project WHERE id = $1', 
      [id], (error, results) => {
        if (error) {
          console.log(error);
          esponse.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("Project not found");
        }else{
          response.status(200).json("Project deleted with ID: " + id);
        }
      }
    );
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