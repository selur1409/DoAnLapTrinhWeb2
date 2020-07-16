const express = require('express');
const editorModel = require('../models/editor.model');
const moment = require('moment');
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
    });
});

router.get('/pending', async function (req, res) {
    const IdStatus=4;
    const IsActivePending=true;
    const idCategories=await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
    const list = await editorModel.LoadPostIsPending(IdStatus,idCategories[0].IdCategories);
    for (d of list){
      d.DatePost =  moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
    }
    res.render('vwEditor/listPost', {
      IsActivePending:IsActivePending,
      listPost: list,
      empty: list.length === 0,
      layout: 'homeeditor',
      Status: IdStatus
    });
  });

  router.get('/accepted', async function (req, res) {
    const IdStatus=1;
    const IsActiveAccepted=true;
    const idCategories=await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
    const list = await editorModel.LoadPostIsPending(IdStatus,idCategories[0].IdCategories);
    for (d of list){
      d.DatePost =  moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
    }
    res.render('vwEditor/listPost', {
      listPost: list,
      IsActiveAccepted:IsActiveAccepted,
      empty: list.length === 0,
      layout: 'homeeditor',
      Status: IdStatus
    });
  });

  router.get('/denied', async function (req, res) {
    const IdStatus=3;
    const IsActiveDenied=true;
    const idCategories=await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
    const list = await editorModel.LoadPostIsPending(IdStatus,idCategories[0].IdCategories);
    for (d of list){
      d.DatePost =  moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
    }
    res.render('vwEditor/listPost', {
      listPost: list,
      IsActiveDenied:IsActiveDenied,
      empty: list.length === 0,
      layout: 'homeeditor',
      Status: IdStatus
    });
  });
  router.get('/deny/:Id', async function (req, res) {
    const list = await editorModel.LoadAuthorOfPost(req.params.Id);
    const categories= await editorModel.LoadCategoriesById(list[0].IdCategories);
    res.render('vwEditor/deny', {
      categories:categories[0],
      denyPost: list[0],
      empty: list.length === 0,
      layout: 'homeeditor'
    });
  });
  router.post('/denyPost', async function (req, res) {
    const IsDelete=0;
    const Status=3;
    const DatetimeApproval= moment().format('YYYY-MM-DD HH:mm:ss');
    const IdPost=req.body.idPost;
    const Note =req.body.reasonDeny;
    const IdEditor=res.locals.lcAuthUser.IdAccount;
    const categoriesPost=req.body.idCate;

    const IdEditorAccount =await editorModel.LoadIdEditor(IdEditor,categoriesPost);
    const ValueOfFeedback = ['Note', 'Status', 'DatetimeApproval', 'IdEditorAccount', 'IdPost',	'IsDelete', `${Note}`, `${Status}`, `${DatetimeApproval}`, `${IdEditorAccount[0].id}`, `${IdPost}`, `${IsDelete}`];
    const result = await editorModel.InsertFeedbackPost(ValueOfFeedback);
    const entity={
      Id:IdPost,
      IdStatus:3
    }
    const updateStatusPost= await editorModel.UpdateStatusPost(entity);
    var success=false;
    if(result!=null)
    {
      success= true;
    }
    res.redirect('/editor/pending');

  });

  
router.get('/reviewPost/:Id', async function (req, res) {
    const list = await editorModel.LoadSinglePost(req.params.Id);
    for (d of list){
      d.DatePost =  moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
    }
    const listTag= await editorModel.LoadTagOfPost(req.params.Id);
    const authorPost= await editorModel.LoadAuthorOfPost(req.params.Id);
    res.render('vwEditor/reviewPost', {
      author:authorPost[0],
      listTag:listTag,
      reviewPost: list[0],
      empty: list.length === 0,
      layout: 'homeeditor'
    });
  });
module.exports = router;