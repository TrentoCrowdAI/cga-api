/**
 * SurveyComponents queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSurveyComponents = (request, response) => {
  var survey_id = parseInt(request.params.id);
  
  if(survey_id != undefined && !isNaN(survey_id)){
    pool.query('SELECT * FROM survey_component WHERE survey_id = $1 ORDER BY id ASC', 
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
    response.status(400).json("Invalid id");
  }
}

const getSurveyComponentById = (request, response) => {
  var survey_component_id = parseInt(request.params.id);
  
  if(survey_component_id != undefined && !isNaN(survey_component_id)){
    pool.query('SELECT * FROM survey_component WHERE id = $1', 
      [survey_component_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results != undefined && results.rowCount == 0){
          response.status(404).send("SurveyComponent not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

const createSurveyComponent = (request, response) => {
  var survey_id = parseInt(request.params.id);
  if(survey_id != undefined && !isNaN(survey_id)){
    if(request.body.survey_component != null && request.body.survey_component.name != null && request.body.survey_component.role_id != null){
      const { name, role_id } = request.body.survey_component;
      pool.query('INSERT INTO survey_component (name, role_id, survey_id) VALUES ($1, $2, $3) RETURNING id', 
        [name, role_id, survey_id], (error, results) => {
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

const updateSurveyComponent = (request, response) => {
  var survey_component_id = parseInt(request.params.id);

  if(survey_component_id != undefined && !isNaN(survey_component_id)){
    if(request.body.survey_component != null && request.body.survey_component.name != null && request.body.survey_component.role_id != null &&
      !isNaN(request.body.survey_component.role_id) && request.body.survey_component.survey_id != null && !isNaN(request.body.survey_component.survey_id)){
      const { name, role_id, survey_id } = request.body.survey_component;
      pool.query('UPDATE survey_component SET name = $1, role_id = $2, survey_id = $3 WHERE id = $4  RETURNING *',
        [name, role_id, survey_id, survey_component_id],
        (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            console.log(request.body.survey_component);
            response.status(404).send("SurveyComponent not found");
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

const deleteSurveyComponent = (request, response) => {
  var survey_component_id = parseInt(request.params.id);

  if(survey_component_id != undefined && !isNaN(survey_component_id)){
    pool.query('DELETE FROM survey_component WHERE id = $1', 
      [survey_component_id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("SurveyComponent not found");
        }else{
          response.status(204).send({id: survey_component_id});
        }
      }
    );
  }else{
    response.status(400).send("Invalid Id");
  }
}

module.exports = {
  getSurveyComponents,
  getSurveyComponentById,
  createSurveyComponent,
  updateSurveyComponent,
  deleteSurveyComponent,
};