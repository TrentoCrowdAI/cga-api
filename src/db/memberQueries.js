/**
 * Members queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getProjectMembers = (request, response) => {
  var project_id = parseInt(request.params.id);
  if(project_id != undefined){
    pool.query('SELECT * FROM member WHERE project_id = $1', 
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
  var isNumber =  /^\d+$/.test(user_id);

  if(project_id != undefined && !isNaN(project_id) && user_id != undefined && isNumber){
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
    response.status(400).send("Invalid Ids");
  }
}

const addMember = (request, response) => {
  var project_id = parseInt(request.params.id);

  if(project_id != undefined && !isNaN(project_id)){
    if(request.body.member != null && request.body.member.user_id != null && request.body.member.status != null && request.body.member.role_id != null){
      const { user_id, status, role_id } = request.body.member;
      pool.query('INSERT INTO member (project_id, user_id, status, creation_date, role_id ) VALUES ($1, $2, $3, NOW(), $4) RETURNING *', 
        [project_id, user_id, status, role_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount != 0){
            response.status(201).send(results.row);
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

const updateMember = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);
  var isNumber =  /^\d+$/.test(user_id);
  if(project_id != undefined && !isNaN(project_id) && user_id != undefined && isNumber){
    if(request.body.member != null && request.body.member.user_id != null && request.body.member.status != null && request.body.member.creation_date != null && request.body.member.role_id != null){
      const { status, creation_date, role_id } = request.body.member;
      pool.query('UPDATE member SET status = $1, creation_date = $2 WHERE project_id = $3 AND user_id = $4 AND role_id = $5 RETURNING *',
        [status, creation_date, project_id, user_id, role_id],
        (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            response.status(404).send("Member not found");
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

const deleteMember = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);
  var isNumber =  /^\d+$/.test(user_id);

  if(project_id != undefined && !isNaN(project_id) && user_id != undefined && isNumber){
    pool.query('DELETE FROM member WHERE project_id = $1 AND user_id = $2', 
      [project_id, user_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("Member not found");
        }else{
          response.status(204).send({id: user_id});
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

module.exports = {
  getProjectMembers,
  getMemberById,
  addMember,
  updateMember,
  deleteMember,
};