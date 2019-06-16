/**
 * SurveyItemOptionLabels queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveyOptionLabels = (request, response) => {
  var survey_item_option_id = parseInt(request.params.id);
  
  if(survey_item_option_id != undefined && !isNaN(survey_item_option_id)){
    pool.query('SELECT * FROM label_survey_item_option WHERE survey_item_option_id = $1 ORDER BY id ASC', 
      [survey_item_option_id], (error, results) => {
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

const getSurveyOptionLabelById = (request, response) => {
  var survey_item_option_id = parseInt(request.params.id);
  
  if(survey_item_option_id != undefined && !isNaN(survey_item_option_id)){
    pool.query('SELECT * FROM label_survey_item_option WHERE id = $1', 
      [survey_item_option_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results != undefined && results.rowCount == 0){
          response.status(404).send("SurveyOptionLabel not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

const createSurveyOptionLabel = (request, response) => {
  var survey_item_option_id = parseInt(request.params.id);
  if(survey_item_option_id != undefined && !isNaN(survey_item_option_id)){
    if(request.body.label_survey_item_option != null && request.body.label_survey_item_option.language != null && request.body.label_survey_item_option.content != null){
      const { language, content } = request.body.label_survey_item_option;
      pool.query('INSERT INTO label_survey_item_option (language, content, survey_item_option_id) VALUES ($1, $2, $3) RETURNING id', 
        [language, content, survey_item_option_id], (error, results) => {
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

const updateSurveyOptionLabel = (request, response) => {
  var survey_item_label_id = parseInt(request.params.id);

  if(survey_item_label_id != undefined && !isNaN(survey_item_label_id)){
    if(request.body.label_survey_item_option != null && request.body.label_survey_item_option.language != null && request.body.label_survey_item_option.content != null &&
       request.body.label_survey_item_option.survey_item_option_id != null && !isNaN(request.body.label_survey_item_option.survey_item_option_id)){
      const { language, content, survey_item_option_id } = request.body.label_survey_item_option;
      pool.query('UPDATE label_survey_item_option SET language = $1, content = $2, survey_item_option_id = $3 WHERE id = $4  RETURNING *',
        [language, content, survey_item_option_id, survey_item_label_id],
        (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            console.log(request.body.label_survey_item_option);
            response.status(404).send("SurveyOptionLabel not found");
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

const deleteSurveyOptionLabel = (request, response) => {
  var survey_item_label_id = parseInt(request.params.id);

  if(survey_item_label_id != undefined && !isNaN(survey_item_label_id)){
    pool.query('DELETE FROM label_survey_item_option WHERE id = $1', 
      [survey_item_label_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("SurveyOptionLabel not found");
        }else{
          response.status(204).send({id: survey_item_label_id});
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

module.exports = {
  getSurveyOptionLabels,
  getSurveyOptionLabelById,
  createSurveyOptionLabel,
  updateSurveyOptionLabel,
  deleteSurveyOptionLabel,
};