const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');

const hbs = exphbs.create({
  defaultLayout: 'home',
  extname: '.hbs',
  helpers: {
    section: hbs_sections(),
  }
})

module.exports = function(app){
    app.engine('hbs', hbs.engine),
    app.set('view engine', 'hbs')
}

module.exports.hbs = hbs;