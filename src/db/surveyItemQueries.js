/**
 * SurveyItems queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveyItems = (request, response) => {
  var survey_component_id = parseInt(request.params.id);
  
  if(survey_component_id != undefined && !isNaN(survey_component_id)){
    getItems(survey_component_id).then((result) => {
      response.status(200).json(result);
    });
  }else{
    response.status(400).json("Invalid id");
  }
}

function getItems(survey_component_id){
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM survey_item WHERE survey_component_id = $1 ORDER BY id ASC', 
      [survey_component_id], (error, resultsItem) => {
        if (error) {
          console.log(error);
        }else{
          if(resultsItem.rows.length > 0){
            let retVal = [];
            let promiseVect = [];
            for(var i = 0; i < resultsItem.rows.length; i++){
              promiseVect.push(loadItem(i, resultsItem));
            }
            Promise.all(promiseVect).then((result) => retVal.push(result)).then((result) => resolve(retVal));
          }
        }
      }
    );
  });
}

function loadItem(i, resultsItem){
  return new Promise((resolve, reject) => {
    getImagesData(i, resultsItem).then((resultImages) => {
      getLabelData(i, resultsItem).then((resultLabels) => {
        getOptions(i, resultsItem).then((resultOption) => {
          resultsItem.rows[i].images = resultImages; 
          resultsItem.rows[i].labels = resultLabels;
          resultsItem.rows[i].options = resultOption;
          resolve(resultsItem.rows[i]);
        });
      });
    });
  });    
}

function getImagesData(i, resultsItem){
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM image_survey_item WHERE survey_item_id = $1 ORDER BY id ASC', 
      [resultsItem.rows[i].id], (error, resultsImages) => {
        if (error) {
          console.log(error);
        }else{
          resolve(resultsImages.rows);
        }
      }
    );
  });
}

function getLabelData(i, resultsItem){
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM label_survey_item WHERE survey_item_id = $1 ORDER BY id ASC', 
      [resultsItem.rows[i].id], (error, resultLabels) => {
        if (error) {
          console.log(error);
        }else{
          resolve(resultLabels.rows);
        }
      }
    )
  });
}

function getOptions(i, resultsItem){
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM survey_item_option WHERE survey_item_id = $1', 
      [resultsItem.rows[i].id], (error, resultOptions) => {
        if (error) {
          console.log(error);
        }else{
          let retVal = [];
          let promiseVect = [];
          for(var i = 0; i < resultOptions.rows.length; i++){
            promiseVect.push(getOptionLabels(i, resultOptions));
          }
          Promise.all(promiseVect).then((result) => retVal.push(result)).then((result) => resolve(retVal));
        }
      }
    );
  });
}

function getOptionLabels(i, resultOptions){
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM label_survey_item_option WHERE id = $1', 
      [resultOptions.rows[i].id], (error, resultOptionLabels) => {
        if (error) {
          console.log(error);
        }else {
          resolve(resultOptionLabels.rows);
        }
      }
    );
  });
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