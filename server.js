const app = require('./src/app');

//Launch the server on port 3000
const server = app.listen(process.env.PORT || 3000 , () => {
  const { address, port } = server.address();
  console.log('Listening at http://localhost:' + port);
});
