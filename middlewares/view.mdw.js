const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { dirname } = require('path');

const hbs = exphbs.create({
  defaultLayout: 'home',
  extname: '.hbs',
  handlebars: Handlebars,
  helpers: {
    section: hbs_sections(),
    buildComment: function buildComment(listComment, level, post){
      if (!level) {
        level = 1;
      }

      let dateTimeFromNow = moment(listComment.DatetimeComment).startOf('hour').fromNow();
      let arrayDate = dateTimeFromNow.split(' ');
      let dateTimeComment;
      if(arrayDate[1] !== 'giờ')
      {
          dateTimeComment = moment(listComment.DatetimeComment, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss DD-MM-YYYY');
      }
      else
      {
          dateTimeComment = dateTimeFromNow;
      }
      listComment.DatetimeComment = dateTimeComment;

      let str = "";
      
      const template = fs.readFileSync(path.join(__dirname, '../templates/Comment.hbs'), "utf8");
      const temp = Handlebars.precompile(template);
      const precompiled = (new Function('return' + temp)());
      str += Handlebars.template(precompiled)({ Comment:listComment, level:level, level2:level !== 3, Post:post });
      if((level === 1 && listComment.list.length !== 0) || (level === 2 && listComment.list.length !== 0))
      {
        str += `<a class="view-all-reply" data-toggle="collapse" href="#collapse${listComment.index}" role="button" aria-expanded="false" aria-controls="#collapse${listComment.index}">
                  <i class="fa fa-chevron-circle-down" aria-hidden="true"></i>
                  <span>more reply</span>
                </a>
                <div class="collapse media-content ml-5 pl-2" id="collapse${listComment.index}"> <div class="vetical"></div>`;
      }

      listComment.list.forEach((o) => {
          str += buildComment(o, level + 1, post);
      });

      if((level === 1 && listComment.list.length !== 0) || (level === 2 && listComment.list.length !== 0))
      {
        str += '</div>';
      }
    
      return new Handlebars.SafeString(str);
    }
  },
})


module.exports = function(app){
    app.engine('hbs', hbs.engine),
    app.set('view engine', 'hbs'),
    app.enabled('view cache')
}

module.exports.hbs = hbs;