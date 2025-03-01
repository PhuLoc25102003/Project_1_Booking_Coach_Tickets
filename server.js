const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const indexRouter = require('./routes/index');
const bodyParser = require('body-parser');
const session = require('express-session');
const authController = require('./controllers/authController');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(session(authController.sessionConfig));

app.use(express.static(path.join(__dirname, 'public')));

app.use(indexRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



