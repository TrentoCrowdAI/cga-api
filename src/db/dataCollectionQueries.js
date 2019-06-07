/**
 * DataCollection queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getProjectDataCollections = (request, response, next) => {
  var project_id = parseInt(request.params.id);
  if(project_id != undefined){
    pool.query('SELECT * FROM data_collection WHERE project_id = ? ORDER BY id ASC', 
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
};

const getDataCollectionById = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var data_collection_id = parseInt(request.params.id2);

  if(project_id != undefined && data_collection_id != undefined){
    pool.query('SELECT * FROM data_collection WHERE project_id = $1 AND id = $2', 
      [project_id, data_collection_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("DataCollection not found");
        }else{
          response.status(200).json(results.rows)
        }  
      }
    );
  }else{
    response.status(400).send("Invalid ids");
  }
}

const createDataCollection = (request, response) => {
  var project_id = parseInt(request.params.id);
  const { name, description, type, startDate, endDate } = request.body.dataCollection;

  if(project_id != undefined){
    pool.query('INSERT INTO data_collection (name, description, type, start, "end", project_id) VALUES (\'$1\', \'$2\', \'$3\', $4, $5, $6)  RETURNING id', 
      [name, description, type, startDate, endDate, project_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount != 0){
          response.status(201).send("DataCollection added with ID: " + results.rows[0].id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const updateDataCollection = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var data_collection_id = parseInt(request.params.id2);
  const { name, description, type, startDate, endDate } = request.body.dataCollection;

  if(project_id != undefined && data_collection_id != undefined){
    pool.query( 'UPDATE data_collection SET name = $1, description = $2, type = $3, start = $4, "end" = $5, WHERE project_id = $6 AND id = $7',
      [name, description, type, startDate, endDate, project_id, data_collection_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("DataCollection not found");
        }else{
          response.status(200).send("DataCollection modified with ID: " + data_collection_id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const deleteDataCollection = (request, response) => {
  var project_id = parseInt(request.params.id1);
  var data_collection_id = parseInt(request.params.id2);

  if(project_id != undefined && data_collection_id != undefined){
    pool.query('DELETE FROM data_collection WHERE project_id = $1 AND id = $2', 
      [project_id, data_collection_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("DataCollection not found");
        }else{
          response.status(200).send("DataCollection deleted with ID: " + data_collection_id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const getDataCollectionById_dataCollection = (request, response) => {
  var data_collection_id = parseInt(request.params.id);
  var project_id = request.body.projectId;
  
  if(project_id != undefined && data_collection_id != undefined){
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
    })
  }else{
    response.status(400).send("Invalid ids");
  }
}

const updateDataCollection_dataCollection = (request, response) => {
  var data_collection_id = parseInt(request.params.id);
  var project_id = request.body.projectId;

  if(project_id != undefined && data_collection_id != undefined){
    pool.query('UPDATE data_collection SET name = $1, description = $2, type = $3, start = $4, "end" = $5, WHERE project_id = $6 AND id = $7',
      [name, description, type, start, end, project_id, data_collection_id], (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
      }else if(results.rowCount == 0){
        response.status(404).send("DataCollection not found");
      }else{
        response.status(200).send("DataCollection modified with ID: " + data_collection_id);
      }
      }
    );
  }else{
    response.status(400).send("Invalid ids");
  }
}

const deleteDataCollection_dataCollection = (request, response) => {
  var data_collection_id = parseInt(request.params.id);
  var project_id = request.body.projectId;

  if(project_id != undefined && data_collection_id != undefined){
    pool.query('DELETE FROM data_collection WHERE project_id = $1 AND id = $2', 
      [project_id, data_collection_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("DataCollection not found");
        }else{
          response.status(200).send("DataCollection deleted with ID: " + data_collection_id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid ids");
  }
}

module.exports = {
  getProjectDataCollections,
  getDataCollectionById,
  createDataCollection,
  updateDataCollection,
  deleteDataCollection,
  getDataCollectionById_dataCollection,
  updateDataCollection_dataCollection,
  deleteDataCollection_dataCollection
};