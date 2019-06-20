/**
 * SurveyItems queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveyItems = (request, response) => {
  var survey_component_id = parseInt(request.params.id);
  
  if(survey_component_id != undefined && !isNaN(survey_component_id)){
    pool.query('SELECT * FROM survey_item WHERE survey_component_id = $1 ORDER BY id ASC', 
      [survey_component_id], (error, resultsItem) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else{
          
          for(var i = 0; i < resultsItem.rows.lenght; i++){
            //loading images
            pool.query('SELECT * FROM image_survey_item WHERE survey_item_id = $1 ORDER BY id ASC', 
              [resultsItem.rows[i].id], (error, resultsImages) => {
                if (error) {
                  console.log(error);
                }else{
                  resultsItem.rows[i].images = resultsImages.rows;
                }
              }
            );

            //loading labels
            pool.query('SELECT * FROM label_survey_item WHERE survey_item_id = $1 ORDER BY id ASC', 
              [resultsItem.rows[i].id], (error, resultLabels) => {
                if (error) {
                  console.log(error);
                }else{
                  resultsItem.rows[i].labels = resultLabels.rows;
                }
              }
            );

            //loading options
            pool.query('SELECT * FROM survey_item_option WHERE id = $1', 
              [survey_item_id], (error, resultOptions) => {
                if (error) {
                  console.log(error);
                }else{
                  for(var i = 0; i < resultOptions.rows.lenght; i++){
                    //loading options label
                    pool.query('SELECT * FROM label_survey_item_option WHERE id = $1', 
                      [resultOptions.rows[i].id], (error, resultOptionLabels) => {
                        if (error) {
                          console.log(error);
                        }else {
                          resultOptions.rows[i].labels = resultOptionLabels.rows
                        }
                      }
                    );
                  }
                  resultsItem.rows[i].labels = resultOptions.rows;
                }
              }
            );

            response.status(200).json(resultsItem.rows);
          }
        }
      }
    );
  }else{
    response.status(400).json("Invalid id");
  }
}

const getSurveyItemById = (request, response) => {
  var survey_component_id = parseInt(request.params.id);
  
  if(survey_component_id != undefined && !isNaN(survey_component_id)){
    pool.query('SELECT * FROM survey_item WHERE id = $1', 
      [survey_component_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results != undefined && results.rowCount == 0){
          response.status(404).send("SurveyItem not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

const createSurveyItem = (request, response) => {
  var survey_component_id = parseInt(request.params.id);
  if(survey_component_id != undefined && !isNaN(survey_component_id)){
    if(request.body.survey_item != null && request.body.survey_item.name != null && request.body.survey_item.type != null){
      const { name, type } = request.body.survey_item;
      pool.query('INSERT INTO survey_item (name, type, survey_component_id) VALUES ($1, $2, $3) RETURNING id', 
        [name, type, survey_component_id], (error, results) => {
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

const updateSurveyItem = (request, response) => {
  var survey_item_id = parseInt(request.params.id);

  if(survey_item_id != undefined && !isNaN(survey_item_id)){
    if(request.body.survey_item != null && request.body.survey_item.name != null && request.body.survey_item.type != null &&
       request.body.survey_item.survey_component_id != null && !isNaN(request.body.survey_item.survey_component_id)){
      const { name, type, survey_component_id } = request.body.survey_item;
      pool.query('UPDATE survey_item SET name = $1, type = $2, survey_component_id = $3 WHERE id = $4  RETURNING *',
        [name, type, survey_component_id, survey_item_id],
        (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            console.log(request.body.survey_item);
            response.status(404).send("SurveyItem not found");
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

const deleteSurveyItem = (request, response) => {
  var survey_item_id = parseInt(request.params.id);

  if(survey_item_id != undefined && !isNaN(survey_item_id)){
    pool.query('DELETE FROM survey_item WHERE id = $1', 
      [survey_item_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("SurveyItem not found");
        }else{
          response.status(204).send({id: survey_item_id});
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

module.exports = {
  getSurveyItems,
  getSurveyItemById,
  createSurveyItem,
  updateSurveyItem,
  deleteSurveyItem,
};