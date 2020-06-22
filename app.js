const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const app = express();

const hbs = exphbs.create({
  defaultLayout: 'home',
  extname: '.hbs',
  helpers: {
    section: hbs_sections()
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.urlencoded({
  extended: true
}));

app.use('/public', express.static('public'))

// Trang chủ Home
app.get('/', function (req, res) {
  res.render('index');
})
app.get('/index.html', function (req, res) {
    res.render('index');
})

// route account
const accountRoute = require('./route/account.route');
app.use('/account', accountRoute);

const PORT = 3000;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
})
