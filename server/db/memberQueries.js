/**
 * Members queries
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

const getMembers = (request, response) => {
  pool.query('SELECT * FROM member ORDER BY id ASC', (error, results) => {
    if (error) {
      response.status(400).send("Bad Request");
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

const getMemberById = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);
  if(id != undefined){
    pool.query('SELECT * FROM member WHERE project_id = $1 AND user_id = $2', [project_id, user_id], (error, results) => {
      if (error) {
        response.status(404).send("Member not found");
        throw error;
      }
      response.status(200).json(results.rows)
    })
  }else{
    response.status(400).send("Invalid ids");
  }
}

const createMember = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);
  const { status, create_at, role_id } = request.body;

  pool.query('INSERT INTO member (project_id, user_id, status, create_at, role_id) VALUES ($1, $2, \'$3\', $4, $5)', [project_id, user_id, status, create_at, role_id ], (error, results) => {
    if (error) {
      response.status(400).send("Bad Request");
      throw error;
    }
    response.status(201).send(`Member added with ID: ${result.insertId}`);
  })
}

const updateMember = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);
  const { name, description, creation_date } = request.body;

  if(id != undefined){
    pool.query(
      'UPDATE member SET status = \'$1,\' create_at = $2, role_id = $3 WHERE project_id = $4 AND user_id = $5',
      [name, description, creation_date, id],
      (error, results) => {
        if (error) {
          response.status(404).send("Member not found");
          throw error
        }
        response.status(200).send(`Member modified with ID: ${id}`);
      }
    )
  }else{
    response.status(400).send("Invalid id");
  }
}

const deleteMember = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);
  if(id != undefined){
    pool.query('DELETE FROM member WHERE project_id = $1 AND user_id = $2', [project_id, user_id], (error, results) => {
      if (error) {
        response.status(404).send("Member not found");
        throw error
      }
      response.status(200).send(`Member deleted with ID: ${id}`)
    })
  }else{
    response.status(400).send("Invalid id");
  }
}

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};