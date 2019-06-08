/**
 * DataCollection queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getProjectDataCollections = (request, response) => {
  var project_id = parseInt(request.params.id);
  if(project_id != undefined && !isNaN(project_id)){
    pool.query('SELECT * FROM data_collection WHERE project_id = $1 ORDER BY id ASC', 
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
    response.status(400).send("Invalid id");
  }
};

const createDataCollection = (request, response) => {
  var project_id = parseInt(request.params.id);

  if(project_id != undefined && !isNaN(project_id)){
    if(request.body.data_collection != null && request.body.data_collection.name != null && request.body.data_collection.description != null && request.body.data_collection.type != null
      && request.body.data_collection.start_date != null && request.body.data_collection.end_date != null){
      const { name, description, type, start_date, end_date } = request.body.data_collection;
      pool.query('INSERT INTO data_collection (name, description, type, start_date, end_date, project_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', 
        [name, description, type, start_date, end_date, project_id], (error, results) => {
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
  }else{
    response.status(400).send("Invalid Id");
  }
}

const getDataCollectionById = (request, response) => {
  var data_collection_id = parseInt(request.params.id);
  
  if(data_collection_id != undefined && !isNaN(data_collection_id)){
    if(request.body.project_id != undefined && !isNaN(request.body.project_id)){
      var project_id = parseInt(request.body.project_id);
      pool.query('SELECT * FROM data_collection WHERE project_id = $1 AND id = $2', 
        [project_id, data_collection_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            response.status(404).send("DataCollection not found");
          }else{
            response.status(200).json(results.rows);
          }
        }
      );
    }else{
      response.status(400).send("Bad Request");
    }
  }else{
    response.status(400).send("Invalid Id");
  }
}

const updateDataCollection = (request, response) => {
  var data_collection_id = parseInt(request.params.id);

  if(data_collection_id != undefined && !isNaN(data_collection_id)){
    if(request.body.data_collection != null && request.body.data_collection.name != null && request.body.data_collection.description != null && request.body.data_collection.type != null
      && request.body.data_collection.start_date != null && request.body.data_collection.end_date != null && request.body.data_collection.project_id != undefined && !isNaN(request.body.data_collection.project_id)){
      var project_id = parseInt(request.body.data_collection.project_id);
      const { name, description, type, start_date, end_date } = request.body.data_collection;
      pool.query('UPDATE data_collection SET name = $1, description = $2, type = $3, start_date = $4, end_date = $5 WHERE project_id = $6 AND id = $7 RETURNING *',
        [name, description, type, start_date, end_date, project_id, data_collection_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            response.status(404).send("DataCollection not found");
          }else{
            response.status(202).send(results.rows);
          }
        }
      );
    }else{
      response.status(400).send("Bad Request");
    }
  }else{
    response.status(400).send("Invalid Ids");
  }
}

const deleteDataCollection = (request, response) => {
  var data_collection_id = parseInt(request.params.id);

  if(data_collection_id != undefined && !isNaN(data_collection_id)){
    if(request.body.data_collection != undefined && request.body.data_collection.project_id != undefined && !isNaN(request.body.data_collection.project_id)){
      var project_id = parseInt(request.body.data_collection.project_id);
      pool.query('DELETE FROM data_collection WHERE project_id = $1 AND id = $2', 
        [project_id, data_collection_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            response.status(404).send("DataCollection not found");
          }else{
            response.status(204).send({id: data_collection_id});
          }
        }
      );
    }else{
      response.status(400).send("Bad Request");
    }
  }else{
    response.status(400).send("Invalid Id");
  }
}

module.exports = {
  getProjectDataCollections,
  getDataCollectionById,
  createDataCollection,
  updateDataCollection,
  deleteDataCollection
};