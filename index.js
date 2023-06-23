const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const bodyParser = require('body-parser')
const busboy = require('busboy-body-parser');
const apiRouter = require('./server/src/routers/api-router');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboy());

app.use('/api', apiRouter);
app.use('/', serveStatic(path.join(__dirname, '/client/build')));
app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

const start = () => {
  try {
    app.listen(process.env.PORT || 7070, () => {
      console.log('Server is running');
    });
  } catch (error) {
    console.log(`Error on server setup: ${error}`)
  }
}

start();