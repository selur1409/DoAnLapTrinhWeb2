

module.exports = function (app) { 
    app.use(async function (req, res, next) {
      const rows = [
        {
          link: 'accounts',
          title: 'Accounts'
        },
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
        }
      ];
      res.locals.lcManage = rows;
      next();
    })
}
  