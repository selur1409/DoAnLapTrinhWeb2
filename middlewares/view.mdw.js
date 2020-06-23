const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');


module.exports = function (app) {
  app.engine('hbs', exphbs({
    defaultLayout: 'home',
    extname: '.hbs',
    helpers: {
      section: hbs_sections()
    }
  }));
  app.set('view engine', 'hbs');
}
