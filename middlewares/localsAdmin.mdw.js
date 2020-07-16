

module.exports = function (app) { 
    app.use(async function (req, res, next) {
      const rows = [
        {
          link: 'categories',
          title: 'Categories'
        },
        {
          link: 'tags',
          title: 'Tags'
        },
        {
          link: 'posts',
          title: 'Posts'
        },
        {
          link: 'accounts',
          title: 'Accounts'
        }
      ];
      res.locals.lcManage = rows;
      next();
    })
}
  