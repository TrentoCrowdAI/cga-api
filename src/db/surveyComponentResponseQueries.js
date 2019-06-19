/**
 * SurveyComponentResponses queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveyComponentResponses = (request, response) => {
  var survey_response_id = parseInt(request.params.id);
  
  if(survey_response_id != undefined && !isNaN(survey_response_id)){
    pool.query('SELECT * FROM survey_component_response WHERE survey_response_id = $1 ORDER BY id ASC', 
      [survey_response_id], (error, results) => {
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

const getSurveyComponentResponseById = (request, response) => {
  var survey_component_id = parseInt(request.params.id);
  
  if(survey_component_id != undefined && !isNaN(survey_component_id)){
    pool.query('SELECT * FROM survey_component_response WHERE id = $1', 
      [survey_component_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results != undefined && results.rowCount == 0){
          response.status(404).send("SurveyComponentResponse not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

const createSurveyComponentResponse = (request, response) => {
  var survey_response_id = parseInt(request.params.id);
  if(survey_response_id != undefined && !isNaN(survey_response_id)){
    if(request.body.survey_component_response != null && request.body.survey_component_response.user_id != null){
      var isNumber =  /^\d+$/.test(request.body.survey_component_response.user_id);
      if(isNumber && request.body.survey_component_response.survey_component_id != null){
        const user_id = request.body.survey_component_response.user_id;
        const survey_component_id = request.body.survey_component_response.survey_component_id;
        pool.query('INSERT INTO survey_component_response (status, creation_date, user_id, survey_response_id, survey_component_id) VALUES (\'incomplete\', NOW(), $1, $2, $3) RETURNING *', 
          [user_id, survey_response_id, survey_component_id], (error, results) => {
            if (error) {
              console.log(error);
              response.status(500).send("Internal Server Error");
            }else if(results.rowCount != 0){
              response.status(201).send(results.rows);
            }
          }
        );
      }else{
        response.status(400).send("Bad Request");
      }
    }else{
      response.status(400).send("Bad Request");
    }
  }else{
    response.status(400).send("Invalid Id");
  }
}

const updateSurveyComponentResponse = (request, response) => {
  var survey_component_response_id = parseInt(request.params.id);

  if(survey_component_response_id != undefined && !isNaN(survey_component_response_id)){
    if(request.body.survey_component_response != null ){
      var isNumber =  /^\d+$/.test(request.body.survey_component_response.user_id);
      if( request.body.survey_component_response.status != null && request.body.survey_component_response.creation_date != null &&
        request.body.survey_component_response.user_id && isNumber && request.body.survey_component_response.survey_response_id != null && !isNaN(request.body.survey_component_response.survey_response_id)
          && request.body.survey_component_response.survey_component_id != null && !isNaN(request.body.survey_component_response.survey_component_id)){
        const { status, creation_date, user_id, survey_response_id, survey_component_id } = request.body.survey_component_response;
        pool.query('UPDATE survey_component_response SET status = $1, creation_date = $2, user_id = $3, survey_response_id = $4, survey_component_id = $5 WHERE id = $6 RETURNING *',
          [status, creation_date, user_id, survey_response_id, survey_component_id, survey_component_response_id],
          (error, results) => {
            if (error) {
              console.log(error);
              response.status(500).send("Internal Server Error");
            }else if(results.rowCount == 0){
              response.status(404).send("SurveyComponentResponse not found");
            }else{
              response.status(202).send(results.rows);
            }
          }
        );
      }else{
        response.status(400).send("Bad Request");
      }
    }else{
      response.status(400).send("Bad Request");
    }
  }else{
    response.status(400).send("Invalid Id");
  }
}

const deleteSurveyComponentResponse = (request, response) => {
  var survey_component_response_id = parseInt(request.params.id);

  if(survey_component_response_id != undefined && !isNaN(survey_component_response_id)){
    pool.query('DELETE FROM survey_component_response WHERE id = $1', 
      [survey_component_response_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("SurveyComponentResponse not found");
        }else{
          response.status(204).send({id: survey_component_response_id});
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

module.exports = {
  getSurveyComponentResponses,
  getSurveyComponentResponseById,
  createSurveyComponentResponse,
  updateSurveyComponentResponse,
  deleteSurveyComponentResponse,
};