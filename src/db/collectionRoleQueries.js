/**
 * CollectionRole queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getProjectCollectionRoles = (request, response) => {
  var project_id = parseInt(request.params.id);
  if(project_id != undefined){
    pool.query('SELECT * FROM collection_role WHERE id = $1', [id], (error, results) => {
      if (error) {
        console.log(error);
        response.status(404).send("Project not found");
      }
      response.status(200).json(results.rows)
    });
  }else{
    response.status(400).send("Invalid id");
  }
}

const getCollectionRoleById = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);
  var role_id = parseInt(request.params.id3);
  if(project_id != undefined && user_id != undefined && role_id != undefined){
    pool.query('SELECT * FROM collection_role WHERE member_project_id = $1 AND member_user_id = $2 AND role_id = $3', 
    [project_id, user_id, role_id], (error, results) => {
      if (error) {
        console.log(error);
        response.status(404).send("Project not found");
      }
      response.status(200).json(results.rows)
    });
  }else{
    response.status(400).send("Invalid ids");
  }
}

const assignCollectionRole = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);
  var role_id = parseInt(request.params.id3);
  const { description } = request.body.collectionRole;

  if(project_id != undefined && user_id != undefined && role_id != undefined){
    pool.query('INSERT INTO collection_role (role_id, description, member_project_id, member_user_id) VALUES ($1, \'$2\', $3, $4)', 
    [role_id, description, project_id, user_id], (error, results) => {
      if (error) {
        console.log(error);
        response.status(400).send("Bad Request");
      }
      response.status(201).send("CollectionRole added with ID: ${result.insertId}");
    });
  }else{
    response.status(400).send("Invalid ids");
  }
}

const updateCollectionRole = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);
  var role_id = parseInt(request.params.id3);
  const { description } = request.body.collectionRole;

  if(project_id != undefined && user_id != undefined && role_id != undefined){
    pool.query(
    'UPDATE collection_role SET role_id = $1, description = \'$2\' WHERE member_project_id = $3 AND member_user_id = $4',
    [role_id, description, project_id, user_id],
      (error, results) => {
      if (error) {
        console.log(error);
        response.status(404).send("CollectionRole not found");
      }
      response.status(200).send("CollectionRole modified with ID: ${id}");
    });
  }else{
    response.status(400).send("Invalid ids");
  }
}

const deleteCollectionRole = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var user_id = parseInt(request.params.id2);
  var role_id = parseInt(request.params.id3);
  
  if(project_id != undefined && user_id != undefined && role_id != undefined){
    pool.query('DELETE FROM collection_role WHERE member_project_id = $1 AND member_user_id = $2 AND role_id = $3', 
    [project_id, user_id, role_id], (error, results) => {
      if (error) {
        console.log(error);
        response.status(404).send("CollectionRole not found");
      }
      response.status(200).send("CollectionRole deleted with ID: ${id}");
    })
  }else{
    response.status(400).send("Invalid ids");
  }
}

module.exports = {
  getProjectCollectionRoles,
  getCollectionRoleById,
  assignCollectionRole,
  updateCollectionRole,
  deleteCollectionRole
};