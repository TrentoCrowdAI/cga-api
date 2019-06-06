/**
 * Surveys queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveys = (request, response) => {
  var dataCollectionId = request.body.dataCollectionId;
  if(dataCollectionId != undefined){
    pool.query('SELECT * FROM survey WHERE data_collection_id = $1 ORDER BY id ASC', 
      [dataCollectionId], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results != undefined){
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
  var dataCollectionId = request.body.dataCollectionId;
  
  if(survey_id != undefined && dataCollectionId != undefined){
    pool.query('SELECT * FROM survey WHERE id = $1 AND data_collection_id = $2', 
      [survey_id, dataCollectionId], (error, results) => {
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
    response.status(400).send("Invalid ids");
  }
}

const createSurvey = (request, response) => {
  const { name, description, dataCollectionId } = request.body.dataCollection;

  if(dataCollectionId != undefined){
    pool.query('INSERT INTO survey (name, description, data_collection_id) VALUES ($1, $2, $3)', 
      [name, description, dataCollectionId], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results != null){
          response.status(201).send("Survey added with ID: " + id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const updateSurvey = (request, response) => {
  var survey_id = parseInt(request.params.id);
  const { name, description, dataCollectionId } = request.body.dataCollection;

  if(survey_id != undefined && dataCollectionId != undefined){
    pool.query('UPDATE survey SET name = $1, description = $2, WHERE id = $3 AND data_collection_id = $4',
      [name, description, survey_id, dataCollectionId],
      (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("Survey not found");
        }else{
          response.status(200).send("Survey modified with ID: " + id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid ids");
  }
}

const deleteSurvey = (request, response) => {
  const survey_id = parseInt(request.params.id);
  
  if(survey_id != undefined){
    pool.query('DELETE FROM survey WHERE id = $1', 
      [survey_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("Survey not found");
        }else{
          response.status(200).send("Survey deleted with ID: " + id);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

module.exports = {
  getSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
};