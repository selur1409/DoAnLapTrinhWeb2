//sửa require categoriesModel require('../models/category.model') -> require('../Models/category.model')
const categoriesModel = require('../Models/category.model');
const LRUCache = require('lru-cache');
const GLOBAL_CATEGORIES = 'global categories';
const cache = new LRUCache({
  max: 500,
  maxAge: 1000*60*5
})
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
    const data = cache.get(GLOBAL_CATEGORIES);
    if (!data){
      console.log(`--fetch ${GLOBAL_CATEGORIES}`);
      const listMenu = await categoriesModel.allMain();
      for (l of listMenu){
          l.Sub = await categoriesModel.allSub_Id(l.Id);
      }
      res.locals.lcListMenu = listMenu;
      cache.set(GLOBAL_CATEGORIES, listMenu);
    }
    else{
      console.log(`++ cache hit for ${GLOBAL_CATEGORIES}`);
      res.locals.lcListMenu = data;
    }
    next();
  })
}
