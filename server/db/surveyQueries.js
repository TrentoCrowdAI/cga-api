/**
 * Surveys queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveys = (request, response) => {
  var data_collection_id = parseInt(request.params.id);
  pool.query('SELECT * FROM survey WHERE data_collection_id = $1 ORDER BY id ASC', [data_collection_id], (error, results) => {
    if (error) {
      console.log(err);
      response.status(400).send("Bad Request");
    }
    response.status(200).json(results.rows);
  })
}

const getSurveyById = (request, response) => {
  var survey_id = parseInt(request.params.id);
  var data_collection_id = request.body.dataCollectionId;
  if(id != undefined){
    pool.query('SELECT * FROM survey WHERE id = $1 AND data_collection_id = $2', [survey_id, data_collection_id], (error, results) => {
      if (error) {
        console.log(err);
        response.status(404).send("Survey not found");
      }
      response.status(200).json(results.rows)
    })
  }else{
    response.status(400).send("Invalid id");
  }
}

const createSurvey = (request, response) => {
  var data_collection_id = parseInt(request.params.id);
  const { name, description } = request.body;
  if(data_collection_id != undefined){
    pool.query('INSERT INTO survey (name, description, data_collection_id) VALUES (\'$1\', \'$2\', $3)', [name, description, data_collection_id], (error, results) => {
      if (error) {
        console.log(err);
        response.status(400).send("Bad Request");
      }
      response.status(201).send("Survey added with ID: ${result.insertId}");
    })
  }else{
    response.status(400).send("Invalid id");
  }
}

const updateSurvey = (request, response) => {
  var survey_id = parseInt(request.params.id);
  const { name, description, data_collection_id } = request.body;

  if(survey_id != undefined){
    pool.query(
      'UPDATE survey SET name = \'$1\', description = \'$2\', WHERE id = $3 AND data_collection_id = $4',
      [name, description, survey_id, data_collection_id],
      (error, results) => {
        if (error) {
          console.log(err);
          response.status(404).send("Survey not found");
        }
        response.status(200).send("Survey modified with ID: ${id}");
      }
    )
  }else{
    response.status(400).send("Invalid id");
  }
}

const deleteSurvey = (request, response) => {
  const survey_id = parseInt(request.params.id);
  if(survey_id != undefined){
    pool.query('DELETE FROM survey WHERE id = $1', [survey_id], (error, results) => {
      if (error) {
        console.log(err);
        response.status(404).send("Survey not found");
      }
      response.status(200).send("Survey deleted with ID: ${id}");
    })
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