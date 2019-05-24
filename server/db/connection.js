//const connectionString = "postgres://esqwmoyypnhiac:11ff2bf420b95f4f1fecf97e63cb798e460f773c3c784666be754903ba038b24@ec2-46-137-187-23.eu-west-1.compute.amazonaws.com:5432/d4qgrq47330qln?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory";

//module.exports = {connectionString}


const Pool = require('pg').Pool
const pool = new Pool({
  user: 'esqwmoyypnhiac',
  host: 'ec2-46-137-187-23.eu-west-1.compute.amazonaws.com',
  database: 'd4qgrq47330qln',
  password: '11ff2bf420b95f4f1fecf97e63cb798e460f773c3c784666be754903ba038b24',
  port: 5432,
  ssl: true
});

module.exports = {pool}