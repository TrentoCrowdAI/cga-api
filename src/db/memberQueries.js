/**
 * Members queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getMembers = (request, response, next) => {
  var project_id = parseInt(request.params.id);
  if(project_id != undefined){
    pool.query('SELECT * FROM member WHERE project_id = ? ORDER BY id ASC', 
      [project_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).json("Invalid id");
  }
};

const getMemberById = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);

  if(project_id != undefined && user_id != undefined){
    pool.query('SELECT * FROM member WHERE project_id = $1 AND user_id = $2', 
      [project_id, user_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("Member not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid ids");
  }
}

const createMember = (request, response) => {
  var project_id = parseInt(request.params.id);
  const { user, status, create_at } = request.body;

  if(project_id != undefined){
    pool.query('INSERT INTO member (project_id, user_id, status, create_at ) VALUES ($1, $2, \'$3\', $4)', 
      [project_id, user.id, status, create_at], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount != 0){
          response.status(201).send("Member added with ID: " + user.id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const updateMember = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);
  const { name, created_at, role_id } = request.body;

  if(project_id != undefined && user_id != undefined){
    pool.query(
      'UPDATE member SET status = \'$1,\' create_at = $2 WHERE project_id = $3 AND user_id = $4 AND role_id = $5',
      [name, created_at, project_id, user_id, role_id],
      (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount != 0){
          response.status(404).send("Member not found");
        }else{
          response.status(200).send("Member modified with ID: " + user_id);
        }
      }
    )
  }else{
    response.status(400).send("Invalid ids");
  }
}

const deleteMember = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);
  
  if(project_id != undefined && user_id != undefined){
    pool.query('DELETE FROM member WHERE project_id = $1 AND user_id = $2', 
      [project_id, user_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount != 0){
          response.status(404).send("Member not found");
        }else{
          response.status(200).send("Member deleted with ID: " + user_id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid ids");
  }
}

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};