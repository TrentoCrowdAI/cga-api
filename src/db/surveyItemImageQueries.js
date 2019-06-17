/**
 * SurveyItemImages queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveyItemImages = (request, response) => {
  var survey_item_id = parseInt(request.params.id);
  
  if(survey_item_id != undefined && !isNaN(survey_item_id)){
    pool.query('SELECT * FROM image_survey_item WHERE survey_item_id = $1 ORDER BY id ASC', 
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

const getSurveyItemImageById = (request, response) => {
  var survey_item_id = parseInt(request.params.id);
  
  if(survey_item_id != undefined && !isNaN(survey_item_id)){
    pool.query('SELECT * FROM image_survey_item WHERE id = $1', 
      [survey_item_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results != undefined && results.rowCount == 0){
          response.status(404).send("SurveyItemImage not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

const createSurveyItemImage = (request, response) => {
  var survey_item_id = parseInt(request.params.id);
  if(survey_item_id != undefined && !isNaN(survey_item_id)){
    if(request.body.image_survey_item != null && request.body.image_survey_item.link != null && request.body.image_survey_item.title != null){
      const { link, title } = request.body.image_survey_item;
      pool.query('INSERT INTO image_survey_item (link, title, survey_item_id) VALUES ($1, $2, $3) RETURNING id', 
        [link, title, survey_item_id], (error, results) => {
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

const updateSurveyItemImage = (request, response) => {
  var survey_item_image_id = parseInt(request.params.id);

  if(survey_item_image_id != undefined && !isNaN(survey_item_image_id)){
    if(request.body.image_survey_item != null && request.body.image_survey_item.link != null && request.body.image_survey_item.title != null &&
       request.body.image_survey_item.survey_item_id != null && !isNaN(request.body.image_survey_item.survey_item_id)){
      const { link, title, survey_item_id } = request.body.image_survey_item;
      pool.query('UPDATE image_survey_item SET link = $1, title = $2, survey_item_id = $3 WHERE id = $4  RETURNING *',
        [link, title, survey_item_id, survey_item_image_id],
        (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            console.log(request.body.image_survey_item);
            response.status(404).send("SurveyItemImage not found");
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

const deleteSurveyItemImage = (request, response) => {
  var survey_item_image_id = parseInt(request.params.id);

  if(survey_item_image_id != undefined && !isNaN(survey_item_image_id)){
    pool.query('DELETE FROM image_survey_item WHERE id = $1', 
      [survey_item_image_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("SurveyItemImage not found");
        }else{
          response.status(204).send({id: survey_item_image_id});
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

module.exports = {
  getSurveyItemImages,
  getSurveyItemImageById,
  createSurveyItemImage,
  updateSurveyItemImage,
  deleteSurveyItemImage,
};