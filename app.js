const express = require('express');
const app = express();

app.use(express.urlencoded({
  extended: true
}));

app.use('/public', express.static('public'))

// middlewares
require('./middlewares/session.mdw')(app);
require('./middlewares/locals.mdw')(app);
require('./middlewares/view.mdw')(app);

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
