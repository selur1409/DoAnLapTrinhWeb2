const express = require('express');

// Phần của Khương mới thêm
const multer = require('multer');
const upload = multer();

const app = express();
app.use(upload.array()); 

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'))

// Trang chủ Home
app.get('/', function (req, res) {
  res.render('index');
})
app.get('/index.html', function (req, res) {
    res.render('index');
})

// middlewares
require('./middlewares/session.mdw')(app);
require('./middlewares/locals.mdw')(app);
require('./middlewares/view.mdw')(app);
const {hbs} = require('./middlewares/view.mdw');
const {exposeTemplates} = require('./public/js/exposeTemplate');

// route account
const accountRoute = require('./route/account.route');
app.use('/account', accountRoute);

// Trang writer
app.use('', exposeTemplates, require('./Route/Writer'));


app.use(function (req, res) {
  res.render('404', { layout: false });
})

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('500', { layout: false });
})

const PORT = 3000;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
})
