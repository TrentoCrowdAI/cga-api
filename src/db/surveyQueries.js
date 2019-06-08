/**
 * Surveys queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveys = (request, response) => {
  var data_collection_id = parseInt(request.params.id);
  
  if(data_collection_id != undefined && !isNaN(data_collection_id)){
    pool.query('SELECT * FROM survey WHERE data_collection_id = $1 ORDER BY id ASC', 
      [data_collection_id], (error, results) => {
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
}

const getSurveyById = (request, response) => {
  var survey_id = parseInt(request.params.id);
  
  if(survey_id != undefined && !isNaN(survey_id)){
    if(request.body.data_collection_id != undefined && !isNaN(request.body.data_collection_id)){
      var data_collection_id = request.body.data_collection_id;
      pool.query('SELECT * FROM survey WHERE id = $1 AND data_collection_id = $2', 
        [survey_id, data_collection_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results != undefined && results.rowCount == 0){
            response.status(404).send("Survey not found");
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

const createSurvey = (request, response) => {
  var data_collection_id = parseInt(request.params.id);
  if(data_collection_id != undefined && !isNaN(data_collection_id)){
    if(request.body.survey != null && request.body.survey.name != null && request.body.survey.description != null){
      const { name, description } = request.body.survey;
      pool.query('INSERT INTO survey (name, description, data_collection_id) VALUES ($1, $2, $3) RETURNING id', 
        [name, description, data_collection_id], (error, results) => {
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

const updateSurvey = (request, response) => {
  var survey_id = parseInt(request.params.id);

  if(survey_id != undefined && !isNaN(survey_id)){
    if(request.body.survey != null && request.body.survey.name != null && request.body.survey.description != null &&
      request.body.survey.data_collection_id != null && !isNaN(request.body.survey.data_collection_id)){
      const { name, description, data_collection_id } = request.body.survey;
      pool.query('UPDATE survey SET name = $1, description = $2 WHERE id = $3 AND data_collection_id = $4 RETURNING *',
        [name, description, survey_id, data_collection_id],
        (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            response.status(404).send("Survey not found");
          }else{
            response.status(202).send(results.rows);
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

const deleteSurvey = (request, response) => {
  var survey_id = parseInt(request.params.id);

  if(survey_id != undefined && !isNaN(survey_id)){
    if(request.body.survey != null && request.body.survey.data_collection_id != null && !isNaN(request.body.survey.data_collection_id)){
      var data_collection_id = request.body.survey.data_collection_id;
      pool.query('DELETE FROM survey WHERE id = $1 AND data_collection_id = $2', 
        [survey_id, data_collection_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            response.status(404).send("Survey not found");
          }else{
            response.status(204).send({id: survey_id});
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
  getSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
};