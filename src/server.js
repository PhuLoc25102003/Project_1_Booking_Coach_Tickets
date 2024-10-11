const express = require('express')
const app = express()
const port = 3000
const path = require('path');

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/page1', (req, res) => {
    res.render('page1.ejs')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})