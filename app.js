const express = require('express');
const passport = require('passport');
const passportfb = require('passport-facebook').Strategy;
const db = require('./models/account.model');

// Phần của Khương mới thêm
const multer = require('multer');
const upload = multer();
const flash = require('express-flash');

const app = express();
app.use(upload.array()); 
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
// middlewares
require('./middlewares/session.mdw')(app);
require('./middlewares/locals.mdw')(app);
require('./middlewares/view.mdw')(app);


// Trang chủ Home
app.use('/', require('./route/home.route'));
app.use('/index.html', require('./route/home.route'));

// đăng nhập bằng facebook
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportfb(
  {
    clientID: "593141928292244",
    clientSecret: "f4f2260540dc4d6beb61d8088cb71ccb",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['email']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
  }
));

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(async function (id, done){
    const rows = await db.singleId(id);
    console.log("rows:" + rows);
    if (rows.length === 0){
      return;
    }
    const user = rows[0];
    done (null, user);
});

const {exposeTemplates} = require('./public/js/exposeTemplate');

// route account
const accountRoute = require('./route/account.route');
app.use('/account', accountRoute);
// passport
app.use('/auth', require('./route/auth.route'));

// Trang writer
app.use('/writer', exposeTemplates, require('./Route/Writer'));

// Trang forgot password
app.use(flash());
app.use('/account', require('./route/ForgotPW'));

app.use('/admin', require('./route/admin.route'));

//Trang editor
app.use('/editor', require('./route/editor.route'));

app.use(function (req, res) {
  res.render('404', { layout: false });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('500', { layout: false });
});

const PORT = 3000;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
});
