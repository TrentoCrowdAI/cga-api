/**
 * SurveyItemLabels queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveyItemLabels = (request, response) => {
  var survey_item_id = parseInt(request.params.id);
  
  if(survey_item_id != undefined && !isNaN(survey_item_id)){
    pool.query('SELECT * FROM label_survey_item WHERE survey_item_id = $1 ORDER BY id ASC', 
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

const getSurveyItemLabelById = (request, response) => {
  var survey_item_id = parseInt(request.params.id);
  
  if(survey_item_id != undefined && !isNaN(survey_item_id)){
    pool.query('SELECT * FROM label_survey_item WHERE id = $1', 
      [survey_item_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results != undefined && results.rowCount == 0){
          response.status(404).send("SurveyItemLabel not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

const createSurveyItemLabel = (request, response) => {
  var survey_item_id = parseInt(request.params.id);
  if(survey_item_id != undefined && !isNaN(survey_item_id)){
    if(request.body.label_survey_item != null && request.body.label_survey_item.language != null && request.body.label_survey_item.content != null){
      const { language, content } = request.body.label_survey_item;
      pool.query('INSERT INTO label_survey_item (language, content, survey_item_id) VALUES ($1, $2, $3) RETURNING id', 
        [language, content, survey_item_id], (error, results) => {
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

const updateSurveyItemLabel = (request, response) => {
  var survey_item_label_id = parseInt(request.params.id);

  if(survey_item_label_id != undefined && !isNaN(survey_item_label_id)){
    if(request.body.label_survey_item != null && request.body.label_survey_item.language != null && request.body.label_survey_item.content != null &&
       request.body.label_survey_item.survey_item_id != null && !isNaN(request.body.label_survey_item.survey_item_id)){
      const { language, content, survey_item_id } = request.body.label_survey_item;
      pool.query('UPDATE label_survey_item SET language = $1, content = $2, survey_item_id = $3 WHERE id = $4  RETURNING *',
        [language, content, survey_item_id, survey_item_label_id],
        (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            console.log(request.body.label_survey_item);
            response.status(404).send("SurveyItemLable not found");
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

const deleteSurveyItemLabel = (request, response) => {
  var survey_item_label_id = parseInt(request.params.id);

  if(survey_item_label_id != undefined && !isNaN(survey_item_label_id)){
    pool.query('DELETE FROM label_survey_item WHERE id = $1', 
      [survey_item_label_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("SurveyItemLable not found");
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
  getSurveyItemLabels,
  getSurveyItemLabelById,
  createSurveyItemLabel,
  updateSurveyItemLabel,
  deleteSurveyItemLabel,
};