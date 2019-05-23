const Pool = require('pg').Pool

const pool = new Pool({
  user: 'esqwmoyypnhiac',
  host: 'ec2-46-137-187-23.eu-west-1.compute.amazonaws.com',
  database: 'd4qgrq47330qln',
  password: '11ff2bf420b95f4f1fecf97e63cb798e460f773c3c784666be754903ba038b24',
  port: 5432,
});

module.exports = {pool}