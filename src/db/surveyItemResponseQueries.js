/**
 * SurveyItemResponses queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveyItemResponses = (request, response) => {
  var survey_component_response_id = parseInt(request.params.id);
  
  if(survey_component_response_id != undefined && !isNaN(survey_component_response_id)){
    pool.query('SELECT * FROM survey_item_response WHERE survey_component_response_id = $1 ORDER BY id ASC', 
      [survey_component_response_id], (error, results) => {
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

const getSurveyItemResponseById = (request, response) => {
  var survey_component_id = parseInt(request.params.id);
  
  if(survey_component_id != undefined && !isNaN(survey_component_id)){
    pool.query('SELECT * FROM survey_item_response WHERE id = $1', 
      [survey_component_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results != undefined && results.rowCount == 0){
          response.status(404).send("SurveyItemResponses not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

const createSurveyItemResponse = (request, response) => {
  var survey_component_response_id = parseInt(request.params.id);
  if(survey_component_response_id != undefined && !isNaN(survey_component_response_id)){
    if(request.body.survey_item_response != null && request.body.survey_item_response.name != null && request.body.survey_item_response.value != null && 
      request.body.survey_item_response.survey_item_id != null && !isNaN(request.body.survey_item_response.survey_item_id)){
      const { name, value, survey_item_id } = request.body.survey_item_response;
      pool.query('SELECT * FROM survey_item_response WHERE survey_item_id = $1 AND survey_component_response_id = $2', 
        [survey_item_id, survey_component_response_id], (error, resultsSearch) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          } else if(resultsSearch.rowCount == 0){//the row is new and the we insert it
            pool.query('INSERT INTO survey_item_response (name, value, survey_item_id, survey_component_response_id) VALUES ($1, $2, $3, $4) RETURNING id', 
              [name, value, survey_item_id, survey_component_response_id], (error, results) => {
                if (error) {
                  console.log(error);
                  response.status(500).send("Internal Server Error");
                }else if(results.rowCount != 0){
                  response.status(201).send({id: results.rows[0].id});
                }
              }
            );
          } else if(resultsSearch.rowCount != 0){//the row was already present, than we update it
            pool.query('UPDATE survey_item_response SET name = $1, value = $2 WHERE survey_item_id = $3 AND survey_component_response_id = $4', 
              [name, value, survey_item_id, survey_component_response_id], (error, results) => {
                if (error) {
                  console.log(error);
                  response.status(500).send("Internal Server Error");
                }else if(results.rowCount != 0){
                  response.status(201).send({id: resultsSearch.rows[0].id});
                }
              }
            );
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

const updateSurveyItemResponse = (request, response) => {
  var survey_item_response_id = parseInt(request.params.id);

  if(survey_item_response_id != undefined && !isNaN(survey_item_response_id)){
    if(request.body.survey_item_response != null && request.body.survey_item_response.name != null && request.body.survey_item_response.value != null && 
      request.body.survey_item_response.survey_item_id != null && !isNaN(request.body.survey_item_response.survey_item_id) &&
      request.body.survey_item_response.survey_component_response_id != null && !isNaN(request.body.survey_item_response.survey_component_response_id)){
      const { name, value, survey_item_id, survey_component_response_id } = request.body.survey_item_response;
      pool.query('UPDATE survey_item_response SET name = $1, value = $2, survey_item_id = $3, survey_component_response_id = $4 WHERE id = $5 RETURNING *',
        [name, value, survey_item_id, survey_component_response_id, survey_item_response_id],
        (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            console.log(request.body.survey_item_response);
            response.status(404).send("SurveyItemResponses not found");
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

const deleteSurveyItemResponse = (request, response) => {
  var survey_item_response_id = parseInt(request.params.id);

  if(survey_item_response_id != undefined && !isNaN(survey_item_response_id)){
    pool.query('DELETE FROM survey_item_response WHERE id = $1', 
      [survey_item_response_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("SurveyItemResponses not found");
        }else{
          response.status(204).send({id: survey_item_response_id});
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

module.exports = {
  getSurveyItemResponses,
  getSurveyItemResponseById,
  createSurveyItemResponse,
  updateSurveyItemResponse,
  deleteSurveyItemResponse,
};