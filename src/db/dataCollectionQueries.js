/**
 * DataCollection queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSubjectSurveys = (request, response) => {
  var data_collection_id = parseInt(request.params.id1);
  var subject_id = parseInt(request.params.id2);
  if(data_collection_id != undefined && !isNaN(data_collection_id) && subject_id != undefined && !isNaN(subject_id)){
    pool.query('SELECT C.name, C.survey_id, C.role_id, C.status, C.creation_date, C.survey_component_response_id, C.survey_response_id, C.survey_component_id, count(*) AS count ' + 
                'FROM (SELECT SC.name, SC.survey_id, SC.role_id, SCR.status, SCR.creation_date, SCR.id AS survey_component_response_id, SCR.survey_response_id, SCR.survey_component_id ' + 
                'FROM survey_component_response SCR, survey_component SC ' +
                'WHERE SC.id = SCR.survey_component_id AND SCR.user_id = $1 AND SCR.survey_response_id IN (SELECT id ' + 
                                                                                                          'FROM survey_response ' + 
                                                                                                          'WHERE subject_id = $2 AND survey_id IN (SELECT id ' + 
                                                                                                                                                  'FROM survey ' + 
                                                                                                                                                  'WHERE data_collection_id = $3)) ORDER BY SCR.creation_date ASC) AS C LEFT OUTER JOIN survey_item_response SIR ' +
                'ON C.survey_component_response_id=SIR.survey_component_response_id ' + 
                'GROUP BY (C.name, C.survey_id, C.role_id, C.status, C.creation_date, C.survey_component_response_id, C.survey_response_id, C.survey_component_id)', 
      [request.session.user.id, subject_id, data_collection_id], (error, results) => {
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

const getDataCollectionSubjects = (request, response) => {
  var data_collection_id = parseInt(request.params.id);
  
  if(data_collection_id != undefined && !isNaN(data_collection_id)){
    pool.query('SELECT S.id, S.name, S.surname, S.contact, S.location FROM survey_response SR, survey_component_response SCR, subject S WHERE SR.id = SCR.survey_response_id AND SR.subject_id = S.id AND SR.status = \'incomplete\' AND SCR.user_id = $1 AND survey_id IN (SELECT id FROM survey WHERE data_collection_id = $2) GROUP BY S.id ORDER BY S.surname ASC, S.name ASC', 
      [request.session.user.id, data_collection_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else {
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

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
  getSubjectSurveys,
  getProjectDataCollections,
  getDataCollectionSubjects,
  getDataCollectionById,
  createDataCollection,
  updateDataCollection,
  deleteDataCollection
};