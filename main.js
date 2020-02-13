const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const config = require('./config');
const route = require('./route');
const mongoose = require('mongoose');

// parse requests
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
    .header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
    .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

route(app);
mongoose.Promise = global.Promise;

mongoose
  .connect(config.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conexion a la base de datos fue exitosa."))
  .catch(err => {
    console.log('No se pudo conectar a la base de datos. Terminando proceso', err);
    process.exit();
  });

// listen on port
app.listen(config.serverport, () => {
  console.log("Servidor arranco y esta listo escuchando por el puerto ", config.serverport);
});