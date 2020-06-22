const express = require('express');
const exphbs = require('express-handlebars');

// Phần của Khương mới thêm
const hbs_sections = require('express-handlebars-sections');
const moment = require('moment');
moment.locale("vi");
const multer = require('multer');
const upload = multer();


const app = express();
app.use(upload.array()); 

const hbs = exphbs.create({
  defaultLayout: 'home',
  extname: '.hbs',
  helpers: {
    section: hbs_sections(),
    format_time: function (value) {
      const date = dateFormat(value, "dd/mm/yyyy h:mm TT");
      return date;
    },
    //Post of Writer
    count_index: function(value){
      if(value % 3 === 0 && value !== 0)
      {
        return "<div class=w-100>" + "</div>";
      }
    },
    load_sub_cat:function(context, Id, options){
      let ret="";
      for(let i = 0; i < context.length; i++)
      {
        if(context[i].IdCategoriesMain === Id)
        {
          ret = ret + options.fn(context[i]);
        }
      }
      return ret;
    }
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));
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

// Trang writer
app.use('', require('./Route/Writer'));


const PORT = 3000;
app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
})
