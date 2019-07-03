/**
 * SurveyResponse queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveySubjects = (request, response) => {
  var survey_id = parseInt(request.params.id);
  if(survey_id != undefined && !isNaN(survey_id)){
    pool.query('SELECT * FROM subject WHERE id IN (SELECT subject_id FROM survey_response WHERE survey_id = $1) ORDER BY id ASC', 
      [survey_id], (error, results) => {
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

const addSubjectToSurvey = (request, response) => {
  var survey_id = parseInt(request.params.id);

  if(survey_id != undefined && !isNaN(survey_id)){
    if(request.body.subject != null && request.body.subject.id != null && !isNaN(request.body.subject.id)){
      const subject_id  = request.body.subject.id;
      pool.query('INSERT INTO survey_response (status, creation_date, subject_id, survey_id) VALUES (\'incomplete\', NOW(), $1, $2) RETURNING *', 
        [subject_id, survey_id], (error, results) => {
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

const getSurveyResponses = (request, response) => {
  var survey_id = parseInt(request.params.id);
  
  if(survey_id != undefined && !isNaN(survey_id)){
    pool.query('SELECT * FROM survey_response WHERE survey_id = $1', 
      [survey_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

const getSurveyResponseById = (request, response) => {
  var survey_response_id = parseInt(request.params.id);
  
  if(survey_response_id != undefined && !isNaN(survey_response_id)){
    pool.query('SELECT * FROM survey_response WHERE id = $1', 
      [survey_response_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("SurveyResponse not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

const updateSurveyResponse = (request, response) => {
  var survey_response_id = parseInt(request.params.id);

  if(survey_response_id != undefined && !isNaN(survey_response_id)){
    if(request.body.survey_response != null && request.body.survey_response.status != null && request.body.survey_response.creation_date != null && request.body.survey_response.survey_id != null
      && request.body.survey_response.subject_id != null){
      const { status, creation_date, subject_id, survey_id } = request.body.survey_response;
      pool.query('UPDATE survey_response SET status = $1, creation_date = $2, subject_id = $3, survey_id = $4 WHERE id = $5 RETURNING *',
        [status, creation_date, subject_id, survey_id, survey_response_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            response.status(404).send("SurveyResponse not found");
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

const deleteSurveyResponse = (request, response) => {
  var survey_response_id = parseInt(request.params.id);

  if(survey_response_id != undefined && !isNaN(survey_response_id)){
    pool.query('DELETE FROM survey_response WHERE id = $1', 
      [survey_response_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("SurveyResponse not found");
        }else{
          response.status(204).send({id: survey_response_id});
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

module.exports = {
  getSurveySubjects,
  getSurveyResponseById,
  addSubjectToSurvey,
  getSurveyResponses,
  updateSurveyResponse,
  deleteSurveyResponse
};