/**
 * Users queries
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      response.status(400).send("Bad Request");
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

const getUserById = (request, response) => {
  var id = parseInt(request.params.id)
  if(id != undefined){
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        response.status(404).send("User not found");
        throw error;
      }
      response.status(200).json(results.rows)
    })
  }else{
    response.status(400).send("Invalid id");
  }
}

const createUser = (request, response) => {
  const { name, surname, email, password } = request.body;

  pool.query('INSERT INTO users (name, surname, email, password) VALUES (\'$1\', \'$2\', \'$3\', \'$4\')', [name, surname, email, password], (error, results) => {
    if (error) {
      response.status(400).send("Bad Request");
      throw error;
    }
    response.status(201).send(`User added with ID: ${result.insertId}`);
  })
}

const updateUser = (request, response) => {
  var id = parseInt(request.params.id)
  const { name, surname, email, password } = request.body;

  if(id != undefined){
    pool.query(
      'UPDATE users SET name = \'$1\', surname = \'$2\', email = \'$3\', password = \'$4\' WHERE id = $5',
      [name, surname, email, password, id],
      (error, results) => {
        if (error) {
          response.status(404).send("User not found");
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`);
      }
    )
  }else{
    response.status(400).send("Invalid id");
  }
}

const deleteUser = (request, response) => {
  const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);
    if(id != undefined){
      pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
          response.status(404).send("User not found");
          throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
      })
    }else{
      response.status(400).send("Invalid id");
    }
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};