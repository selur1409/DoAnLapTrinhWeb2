const express = require('express');
const editorModel = require('../models/editor.model');
const moment = require('moment');
const router = express.Router();
const {restrict} = require('../middlewares/auth.mdw');

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
router.get('/',restrict, Authories, function(req, res){
    res.render('vwEditor/index', {
    layout: 'homeeditor'
    });
});

router.get('/pending',restrict, Authories, async function (req, res) {
    const IdStatus=4;
    const IsActivePending=true;
    const idCategories=await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
    var list = [];
    for (id = 0; id < idCategories.length; id++)
    {
      const temp = await editorModel.LoadPostIsPending(IdStatus, idCategories[id].IdCategories);   
      for (d of temp){
        d.DatePost =  moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
        list.push(d);
      }

    }


    res.render('vwEditor/listPost', {
      IsActivePending:IsActivePending,
      listPost: list,
      empty: list.length === 0,
      layout: 'homeeditor',
      Status: IdStatus
    });
  });

  router.get('/accepted',restrict,Authories, async function (req, res) {
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

  router.get('/denied', restrict,Authories, async function (req, res) {
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
  router.get('/deny/:Id', restrict,Authories, async function (req, res) {
    const list = await editorModel.LoadAuthorOfPost(req.params.Id);
    const categories= await editorModel.LoadCategoriesById(list[0].IdCategories);
    res.render('vwEditor/deny', {
      categories:categories[0],
      denyPost: list[0],
      empty: list.length === 0,
      layout: 'homeeditor'
    });
  });

  router.get('/accept/:Id', restrict,Authories, async function (req, res) {
    const categories= await editorModel.LoadCategoriesOfPost(req.params.Id);
    const listCategoriesSub = await editorModel.LoadSubCategories(categories[0].IdCategoriesMain);
    const inforOfPost= await editorModel.LoadSinglePost(req.params.Id);
    console.log(categories);
    console.log(listCategoriesSub);
    console.log(inforOfPost);
    for( i of listCategoriesSub)
    {
      if(i.Id==categories[0].IdCategories)
      {
        listCategoriesSub.pop(i);
      }
    }
    res.render('vwEditor/accept', {
      listCategoriesSub:listCategoriesSub,
      inforOfPost:inforOfPost,
      categoriesSubOfPost:categories[0].IdCategories,
      empty: listCategoriesSub.length === 0,
      layout: 'homeeditor'
    });
  });

  router.post('/denyPost', restrict, Authories, async function (req, res) {
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

  
router.get('/reviewPost/:Id',restrict, Authories, async function (req, res) {
    const list = await editorModel.LoadSinglePost(req.params.Id);
    for (d of list){
      d.DatePost =  moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
    }
    const listTag= await editorModel.LoadTagOfPost(req.params.Id);
    const authorPost= await editorModel.LoadAuthorOfPost(req.params.Id);
    res.render('vwEditor/reviewPost', {
      author:authorPost[0],
      IsActivePending:true,
      listTag:listTag,
      reviewPost: list[0],
      empty: list.length === 0,
      layout: 'homeeditor'
    });
  });
module.exports = router;