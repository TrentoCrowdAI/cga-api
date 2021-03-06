/**
 * Project queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getProjects = (request, response) => {
  pool.query('SELECT * FROM project WHERE id IN (SELECT project_id FROM member WHERE user_id = $1) ORDER BY id ASC', 
    [request.session.user.id], (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
      }else{
        response.status(200).json(results.rows);
      }
    }
  );
}

const getProjectById = (request, response) => {
  var id = parseInt(request.params.id);

  if(id != undefined && !isNaN(id)){
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
  if(request.body.project != null && request.body.project.name != null && request.body.project.description != null ){
    const { name, description } = request.body.project; 
    pool.query('INSERT INTO project (name, description, creation_date) VALUES ($1, $2, NOW()) RETURNING *', 
      [name, description ], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount != 0){
          pool.query('INSERT INTO member (project_id, user_id, status, creation_date, role_id ) VALUES ($1, $2, $3, NOW(), $4) RETURNING *', 
            [results.rows[0].id, request.session.user.id, 'active', 1], (error2, results2) => {  
              if (error2) {
                console.log(error2);
                response.status(500).send("Internal Server Error");
              }else if(results2.rowCount != 0){
                response.status(201).send({id: results.rows[0].id});
              }
            }
          );
        }
      }
    );
  }else{
    response.status(400).send("Bad Request");
  }
}

const updateProject = (request, response) => {
  var project_id = parseInt(request.params.id);

  if(project_id != undefined && !isNaN(project_id)){
    if(request.body.project != null && request.body.project.name != null && request.body.project.description != null && request.body.project.creation_date != null){
      const { name, description, creation_date } = request.body.project;
      pool.query('UPDATE project SET name = $1, description = $2, creation_date = $3 WHERE id = $4 RETURNING *',
        [name, description, creation_date, project_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            response.status(404).send("Project not found");
          }else{
            response.status(202).json(results.rows);
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

const deleteProject = (request, response) => {
  const project_id = parseInt(request.params.id);
  
  if(project_id != undefined && !isNaN(project_id)){
    pool.query('DELETE FROM project WHERE id = $1', 
      [project_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("Project not found");
        }else{
          response.status(204).json({id: project_id});
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