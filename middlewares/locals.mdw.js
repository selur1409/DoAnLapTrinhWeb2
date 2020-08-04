const categoriesModel = require('../models/category.model');

module.exports = function (app) {
  app.use(function (req, res, next) {
    if (req.session.isAuthenticated === null) {
      req.session.isAuthenticated = false;
    }

    res.locals.lcIsAuthenticated = req.session.isAuthenticated;
    res.locals.lcAuthUser = req.session.authAccount;
    
    res.locals.lcIsSubscriber = req.session.isSubscriber;
    res.locals.lcIsWriter = req.session.isWriter;
    res.locals.lcIsEditor = req.session.isEditor;
    res.locals.lcIsAdmin = req.session.isAdmin;

    next();
  })

  app.use(async function (req, res, next) {
    const listMenu = await categoriesModel.allMain();
    for (l of listMenu){
        l.Sub = await categoriesModel.allSub_Id(l.Id);
    }
    res.locals.lcListMenu = listMenu;

    next();
  })


  // app.use(async function (req, res, next) {
  //   const rows = await categoryModel.allWithDetails();
  //   res.locals.lcCategories = rows;
  //   next();
  // })
}
