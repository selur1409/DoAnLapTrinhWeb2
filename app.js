const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

const hbs = exphbs.create({
  defaultLayout: 'home',
  extname: '.hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use('/public', express.static('public'))

// Trang chủ Home
app.get('/', function (req, res) {
  res.render('index');
})
app.get('/index.html', function (req, res) {
    res.render('index');
})

// Trang đăng kí (register)
app.get('/account/register', function (req, res) {
  res.render('vwAccount/register',{
    layout: false
  });
})

const PORT = 3000;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
})
