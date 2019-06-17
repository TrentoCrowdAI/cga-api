const dummyUser = {id: '123123123123123',name: 'John',surname: 'Doe'};

const isLoggedIn = (req, res, next) => {
  if(process.env.NODE_ENV === 'test'){
    req.session = req.session || {};
    req.session.user = dummyUser;
  }else{
    console.log(req.session);
  }
  if (req.session && req.session.user !== undefined) {
    next();
  } else {
    res.status(400).json('User not authenticated');
  }
} 

const isLoggedInWithAdminCheck = async (req, res, next) => {
  if(process.env.NODE_ENV === 'test'){
    req.session = req.session || {};
    req.session.user = dummyUser;
  }else{
    console.log(req.session);
  }
  if (req.session && req.session.user !== undefined) {
    adminCheck(req, res, next);
  } else {
    res.status(400).json('User not authenticated');
  }
}
const connection = require('./db/connection.js');
const pool = connection.pool;

async function adminCheck(request, response, next){
  if(request.path.includes("/members/")){
    var project_id;
    if(request.params.id1 != undefined){
      project_id = request.params.id1;
    }

    if(isNaN(project_id)){
      response.status(403).json('Permission Denied');
    }else{
      pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE project_id = $1 AND user_id = $2)', 
        [project_id, request.session.user.id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rows[0] != null){
            if(results.rows[0].name != null && results.rows[0].name == 'ADMIN'){
              next();
            }
          }else{
            response.status(403).json('Permission Denied');
          }
        }
      );
    }
  }else if(request.path.includes("/projects/") || request.body.project != null){
    var project_id;
    if(request.params.id != undefined){
      project_id = request.params.id;
    }else if(request.body.project != null){
      if(request.body.project.id != null){
        project_id = request.body.project.id;
      }
    }

    if(isNaN(project_id)){
      response.status(403).json('Permission Denied');
    }else{
      pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE project_id = $1 AND user_id = $2)', 
        [project_id, request.session.user.id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rows[0] != null){
            if(results.rows[0].name != null && results.rows[0].name == 'ADMIN'){
              next();
            }
          }else{
            response.status(403).json('Permission Denied');
          }
        }
      );
    }
  }else if(request.path.includes("/dataCollections/") || request.body.data_collection != null){
    var data_collection_id;
    if(request.params.id != undefined){
      data_collection_id = request.params.id;
    }else if(request.body.data_collection != null){
      if(request.body.data_collection.id != null){
        data_collection_id = request.body.data_collection.id;
      }
    }

    if(isNaN(data_collection_id)){
      response.status(403).json('Permission Denied');
    }else{
      pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE user_id = $1 AND project_id IN (SELECT project_id FROM data_collection WHERE id = $2))', 
        [request.session.user.id, data_collection_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rows[0] != null){
            if(results.rows[0].name != null && results.rows[0].name == 'ADMIN'){
              next();
            }
          }else{
            response.status(403).json('Permission Denied');
          }
        }
      );
    }
  }else if(request.path.includes("/surveys/") || request.body.survey != null){
    var survey_id;
    if(request.params.id != undefined){
      survey_id = request.params.id;
    }else if(request.body.survey != null){
      if(request.body.survey.id != null){
        survey_id = request.body.survey.id;
      }
    }

    if(isNaN(survey_id)){
      response.status(403).json('Permission Denied');
    }else{
      pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE user_id = $1 AND project_id IN (SELECT project_id FROM data_collection WHERE id IN (SELECT data_collection_id FROM survey WHERE id = $2)))', 
        [request.session.user.id, survey_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rows[0] != null){
            if(results.rows[0].name != null && results.rows[0].name == 'ADMIN'){
              next();
            }
          }else{
            response.status(403).json('Permission Denied');
          }
        }
      );
    }
  }else if(request.path.includes("/surveyComponents/") || request.body.survey_component != null){
    var survey_component_id;
    if(request.params.id != undefined){
      survey_component_id = request.params.id;
    }else if(request.body.survey_component != null){
      if(request.body.survey_component.id != null){
        survey_component_id = request.body.survey_component.id;
      }
    }

    if(isNaN(survey_component_id)){
      response.status(403).json('Permission Denied');
    }else{
      pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE user_id = $1 AND project_id IN (SELECT project_id FROM data_collection WHERE id IN (SELECT data_collection_id FROM survey WHERE id IN (SELECT survey_id FROM survey_component WHERE id = $2))))', 
        [request.session.user.id, survey_component_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rows[0] != null){
            if(results.rows[0].name != null && results.rows[0].name == 'ADMIN'){
              next();
            }
          }else{
            response.status(403).json('Permission Denied');
          }
        }
      );
    }
  }else if(request.path.includes("/surveyItems/") || request.body.survey_item != null){
    var survey_item_id;
    if(request.params.id != undefined){
      survey_item_id = request.params.id;
    }else if(request.body.survey_item != null){
      if(request.body.survey_item.id != null){
        survey_item_id = request.body.survey_item.id;
      }
    }

    if(isNaN(survey_item_id)){
      response.status(403).json('Permission Denied');
    }else{
      pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE user_id = $1 AND project_id IN (SELECT project_id FROM data_collection WHERE id IN (SELECT data_collection_id FROM survey WHERE id IN (SELECT survey_id FROM survey_component WHERE id IN (SELECT survey_component_id FROM survey_item WHERE id = $2)))))', 
        [request.session.user.id, survey_item_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rows[0] != null){
            if(results.rows[0].name != null && results.rows[0].name == 'ADMIN'){
              next();
            }
          }else{
            response.status(403).json('Permission Denied');
          }
        }
      );
    }
  }else if(request.path.includes("/labels/") || request.body.label_survey_item != null){
    var label_survey_item_id;
    if(request.params.id != undefined){
      label_survey_item_id = request.params.id;
    }else if(request.body.label_survey_item != null){
      if(request.body.label_survey_item.id != null){
        label_survey_item_id = request.body.label_survey_item.id;
      }
    }

    if(isNaN(label_survey_item_id)){
      response.status(403).json('Permission Denied');
    }else{
      pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE user_id = $1 AND project_id IN (SELECT project_id FROM data_collection WHERE id IN (SELECT data_collection_id FROM survey WHERE id IN (SELECT survey_id FROM survey_component WHERE id IN (SELECT survey_component_id FROM survey_item WHERE id IN (SELECT survey_item_id from label_survey_item WHERE id = $2))))))', 
        [request.session.user.id, label_survey_item_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rows[0] != null){
            if(results.rows[0].name != null && results.rows[0].name == 'ADMIN'){
              next();
            }
          }else{
            response.status(403).json('Permission Denied');
          }
        }
      );
    }
  }else if(request.path.includes("/images/") || request.body.image_survey_item != null){
    var image_survey_item_id;
    if(request.params.id != undefined){
      image_survey_item_id = request.params.id;
    }else if(request.body.image_survey_item != null){
      if(request.body.image_survey_item.id != null){
        image_survey_item_id = request.body.image_survey_item.id;
      }
    }

    if(isNaN(image_survey_item_id)){
      response.status(403).json('Permission Denied');
    }else{
      pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE user_id = $1 AND project_id IN (SELECT project_id FROM data_collection WHERE id IN (SELECT data_collection_id FROM survey WHERE id IN (SELECT survey_id FROM survey_component WHERE id IN (SELECT survey_component_id FROM survey_item WHERE id IN (SELECT survey_item_id from image_survey_item WHERE id = $2))))))', 
        [request.session.user.id, image_survey_item_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rows[0] != null){
            if(results.rows[0].name != null && results.rows[0].name == 'ADMIN'){
              next();
            }
          }else{
            response.status(403).json('Permission Denied');
          }
        }
      );
    }
  }else if(request.path.includes("/options/") || request.body.survey_item_option != null){
    var survey_item_option_id;
    if(request.params.id != undefined){
      survey_item_option_id = request.params.id;
    }else if(request.body.survey_item_option != null){
      if(request.body.survey_item_option.id != null){
        survey_item_option_id = request.body.survey_item_option.id;
      }
    }

    if(isNaN(survey_item_option_id)){
      response.status(403).json('Permission Denied');
    }else{
      pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE user_id = $1 AND project_id IN (SELECT project_id FROM data_collection WHERE id IN (SELECT data_collection_id FROM survey WHERE id IN (SELECT survey_id FROM survey_component WHERE id IN (SELECT survey_component_id FROM survey_item WHERE id IN (SELECT survey_item_id from survey_item_option WHERE id = $2))))))', 
        [request.session.user.id, survey_item_option_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rows[0] != null){
            if(results.rows[0].name != null && results.rows[0].name == 'ADMIN'){
              next();
            }
          }else{
            response.status(403).json('Permission Denied');
          }
        }
      );
    }
  }else if(request.path.includes("/optionLabels/") || request.body.label_survey_item_option != null){
    var label_survey_item_option_id;
    if(request.params.id != undefined){
      label_survey_item_option_id = request.params.id;
    }else if(request.body.label_survey_item_option != null){
      if(request.body.survey_item_option.id != null){
        label_survey_item_option_id = request.body.label_survey_item_option.id;
      }
    }

    if(isNaN(label_survey_item_option_id)){
      response.status(403).json('Permission Denied');
    }else{
      pool.query('SELECT * FROM role WHERE id IN (SELECT role_id FROM member WHERE user_id = $1 AND project_id IN (SELECT project_id FROM data_collection WHERE id IN (SELECT data_collection_id FROM survey WHERE id IN (SELECT survey_id FROM survey_component WHERE id IN (SELECT survey_component_id FROM survey_item WHERE id IN (SELECT survey_item_id from survey_item_option WHERE id IN (SELECT survey_item_option_id FROM label_survey_item_option WHERE id = $2)))))))', 
        [request.session.user.id, label_survey_item_option_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rows[0] != null){
            if(results.rows[0].name != null && results.rows[0].name == 'ADMIN'){
              next();
            }
          }else{
            response.status(403).json('Permission Denied');
          }
        }
      );
    }
  }
}

module.exports = {isLoggedIn, isLoggedInWithAdminCheck};