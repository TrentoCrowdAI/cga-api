/**
 * Subject queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const connection = require('./connection');
const pool = connection.pool;

const getSubjects = (request, response) => {
  pool.query('SELECT * FROM subject ORDER BY id ASC', 
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(400).send("Bad Request");
      }else{
        response.status(200).json(results.rows);
      }
    }
  );
}

const getSubjectById = (request, response) => {
  var id = parseInt(request.params.id);

  if(id != undefined && !isNaN(id)){
    pool.query('SELECT * FROM subject WHERE id = $1', 
      [id], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results != null && results.rowCount == 0){
          response.status(404).send("Subject not found");
        }else{
          response.status(200).json(results.rows);
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

const createSubject = (request, response) => {
  if(request.body.subject != null && request.body.subject.name != null && request.body.subject.surname != null && request.body.subject.location != null && request.body.subject.contact != null){
    const { name, surname, location, contact } = request.body.subject;
    pool.query('INSERT INTO subject (name, surname, location, contact) VALUES ($1, $2, $3, $4) RETURNING id', 
      [name, surname, location, contact], (error, results) => {
        if (error) {
          console.log(error);
          response.status(500).send("Internal Server Error");
        }else if(results.rowCount != 0){
          response.status(201).send({"id": results.rows[0].id});
        }
      }
    );
  }else{
    response.status(400).send("Bad Request");
  }
}

const updateSubject = (request, response) => {
  var subject_id = parseInt(request.params.id);

  if(subject_id != undefined && !isNaN(subject_id)){
    if(request.body.subject != null && request.body.subject.name != null && request.body.subject.surname != null && request.body.subject.location != null && request.body.subject.contact != null){
      const { name, surname, location, contact } = request.body.subject;
      pool.query('UPDATE subject SET name = $1, surname = $2, location = $3, contact = $4 WHERE id = $5 RETURNING *',
        [name, surname, location, contact, subject_id], (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).send("Internal Server Error");
          }else if(results.rowCount == 0){
            response.status(404).send("Subject not found");
          }else{
            response.status(202).json(results.rows);
          }
        }
      );
    }else{
      response.status(400).send("Bad Request");
    }
  }else{
    response.status(400).send("Invalid id");
  }
}

const deleteSubject = (request, response) => {
  const subject_id = parseInt(request.params.id);
  
  if(subject_id != undefined && !isNaN(subject_id)){
    pool.query('DELETE FROM subject WHERE id = $1', 
      [subject_id], (error, results) => {
        if (error) {
          console.log(error);
          esponse.status(500).send("Internal Server Error");
        }else if(results.rowCount == 0){
          response.status(404).send("Subject not found");
        }else{
          response.status(204).json({id: subject_id});
        }
      }
    );
  }else{
    response.status(400).send("Invalid id");
  }
}

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};