const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const indexRouter = require('./routes/index');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/homepage', (req, res) => {
    res.render('page1.ejs')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})