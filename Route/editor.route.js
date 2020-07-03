const express = require('express');
const editorModel = require('../models/editor.model');
const router = express.Router();

function Authories(req, res, next)
{
    const TypeAccount = res.locals.lcAuthUser.TypeAccount;
    if(TypeAccount !== 3)
    {
        res.redirect('/error');
    }
    else{
        next();
    }
}
router.get('/', function(req, res){
    res.render('vwEditor/index', {
        layout: 'homeeditor'
    })
});

router.get('/pending', async function (req, res) {
    const IdStatus=4;
    const list = await editorModel.LoadPostIsPending(IdStatus);
    res.render('vwEditor/listPost', {
      pendingPost: list,
      empty: list.length === 0,
      layout: 'homeeditor',
      Status: IdStatus
    });
  });

  router.get('/accepted', async function (req, res) {
    const IdStatus=1;
    const list = await editorModel.LoadPostIsPending(IdStatus);
    res.render('vwEditor/listPost', {
      pendingPost: list,
      empty: list.length === 0,
      layout: 'homeeditor',
      Status: IdStatus
    });
  });

  router.get('/denied', async function (req, res) {
    const IdStatus=3;
    const list = await editorModel.LoadPostIsPending(IdStatus);
    res.render('vwEditor/listPost', {
      pendingPost: list,
      empty: list.length === 0,
      layout: 'homeeditor',
      Status: IdStatus
    });
  });
router.get('/reviewPost/:Id', async function (req, res) {
    const list = await editorModel.LoadSinglePost(req.params.Id);
    res.render('vwEditor/reviewPost', {
      reviewPost: list[0],
      empty: list.length === 0,
      layout: 'homeeditor'
    });
  });
module.exports = router;