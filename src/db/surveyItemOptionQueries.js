/**
 * SurveyItemOptions queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveyItemOptions = (request, response) => {
  var survey_item_id = parseInt(request.params.id);
  
  if(survey_item_id != undefined && !isNaN(survey_item_id)){
    pool.query('SELECT * FROM survey_item_option WHERE survey_item_id = $1 ORDER BY id ASC', 
      [survey_item_id], (error, results) => {
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

const getSurveyItemOptionById = (request, response) => {
  var survey_item_id = parseInt(request.params.id);
  
  if(survey_item_id != undefined && !isNaN(survey_item_id)){
    pool.query('SELECT * FROM survey_item_option WHERE id = $1', 
      [survey_item_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results != undefined && results.rowCount == 0){
          response.status(404).send("SurveyItemOption not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

const createSurveyItemOption = (request, response) => {
  var survey_item_id = parseInt(request.params.id);
  if(survey_item_id != undefined && !isNaN(survey_item_id)){
    if(request.body.survey_item_option != null && request.body.survey_item_option.name != null && request.body.survey_item_option.value != null &&
      request.body.survey_item_option.type != null){
      const { name, value, type } = request.body.survey_item_option;
      pool.query('INSERT INTO survey_item_option (name, value, type, survey_item_id) VALUES ($1, $2, $3, $4) RETURNING id', 
        [name, value, type, survey_item_id], (error, results) => {
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

const updateSurveyItemOption = (request, response) => {
  var survey_item_option_id = parseInt(request.params.id);

  if(survey_item_option_id != undefined && !isNaN(survey_item_option_id)){
    if(request.body.survey_item_option != null && request.body.survey_item_option.name != null && request.body.survey_item_option.value != null &&
      request.body.survey_item_option.type != null &&request.body.survey_item_option.survey_item_id != null && !isNaN(request.body.survey_item_option.survey_item_id)){
        const { name, value, type, survey_item_id } = request.body.survey_item_option;
      pool.query('UPDATE survey_item_option SET name = $1, value = $2, type = $3, survey_item_id = $4 WHERE id = $5 RETURNING *',
        [name, value, type, survey_item_id, survey_item_option_id],
        (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            console.log(request.body.survey_item_option);
            response.status(404).send("SurveyItemOption not found");
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

const deleteSurveyItemOption = (request, response) => {
  var survey_item_option_id = parseInt(request.params.id);

  if(survey_item_option_id != undefined && !isNaN(survey_item_option_id)){
    pool.query('DELETE FROM survey_item_option WHERE id = $1', 
      [survey_item_option_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("SurveyItemOption not found");
        }else{
          response.status(204).send({id: survey_item_option_id});
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

module.exports = {
  getSurveyItemOptions,
  getSurveyItemOptionById,
  createSurveyItemOption,
  updateSurveyItemOption,
  deleteSurveyItemOption,
};