const express = require('express');
const editorModel = require('../models/editor.model');
const moment = require('moment');
const router = express.Router();
const { restrict } = require('../middlewares/auth.mdw');

function Authories(req, res, next) {
  const TypeAccount = res.locals.lcAuthUser.TypeAccount;
  if (TypeAccount !== 3) {
    res.redirect('/error');
  }
  else {
    next();
  }
}
router.get('/', restrict, Authories, function (req, res) {
  res.render('vwEditor/index', {
    layout: 'homeeditor'
  });
});

router.get('/pending', restrict, Authories, async function (req, res) {
  const IdPostPending = 4;
  const IsActivePending = true;
  const idCategories = await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
  var list = [];
  for (id = 0; id < idCategories.length; id++) {
    const temp = await editorModel.LoadPostIsPending(IdPostPending, idCategories[id].IdCategories);
    for (d of temp) {
      d.DatePost = moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
      list.push(d);
    }
  }
  res.render('vwEditor/listPostPending', {
    IsActivePending: IsActivePending,
    listPost: list,
    empty: list.length === 0,
    layout: 'homeeditor',
    Status: IdPostPending
  });
});

router.get('/accepted', restrict, Authories, async function (req, res) {
  const IdPostAccepted = 1;
  const IsActiveAccepted = true;
  const idCategories = await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
  var list = [];
  for (id = 0; id < idCategories.length; id++) {
    const temp = await editorModel.LoadPostIsAccept(IdPostAccepted, idCategories[id].IdCategories);
    for (d of temp) {
      d.DatePost = moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
      d.DatetimePost= moment(d.DatetimePost).format('Do MMMM YYYY, HH:mm:ss');
      list.push(d);
    }
  }
  res.render('vwEditor/listPostAccept', {
    listPost: list,
    IsActiveAccepted: IsActiveAccepted,
    empty: list.length === 0,
    layout: 'homeeditor',
    Status: IdPostAccepted
  });
});

router.get('/denied', restrict, Authories, async function (req, res) {
  const IdPostDenied = 3;
  const IsActiveDenied = true;
  const idCategories = await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
  var list = [];
  for (id = 0; id < idCategories.length; id++) {
    const temp = await editorModel.LoadPostIsDeny(IdPostDenied, idCategories[id].IdCategories);
    for (d of temp) {
      d.DatePost = moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
      list.push(d);
    }
  }
  res.render('vwEditor/listPostDeny', {
    listPost: list,
    IsActiveDenied: IsActiveDenied,
    empty: list.length === 0,
    layout: 'homeeditor',
    Status: IdPostDenied
  });
});
router.get('/deny/:Id', restrict, Authories, async function (req, res) {
  const list = await editorModel.LoadInforPost(req.params.Id);
  const categories = await editorModel.LoadCategoriesById(list[0].IdCategories);
  res.render('vwEditor/deny', {
    categories: categories[0],
    denyPost: list[0],
    empty: list.length === 0,
    layout: 'homeeditor'
  });
});

router.get('/accept/:Id', restrict, Authories, async function (req, res) {
  const IdPost = req.params.Id;
  const categories = await editorModel.LoadCategoriesOfPost(IdPost);
  const listCategoriesSub = await editorModel.LoadSubCategories(categories[0].IdCategoriesMain);
  const inforOfPost = await editorModel.LoadSinglePost(IdPost);
  const author = await editorModel.LoadInforPost(IdPost);
  let tempListCategoriesSub = [];
  for (i of listCategoriesSub) {
    if (i.Id != categories[0].IdCategories) {
      tempListCategoriesSub.push(i);
    }
  }
  const listTagOfPost = await editorModel.LoadTagOfPost(IdPost);
  const listTags = await editorModel.LoadTagsNotOfPost(IdPost);
  res.render('vwEditor/accept', {
    listCategoriesSub: tempListCategoriesSub,
    listTagsOfPost: listTagOfPost,
    listTags: listTags,
    author: author[0],
    inforOfPost: inforOfPost[0],
    categoriesSubOfPost: categories[0],
    empty: listCategoriesSub.length === 0,
    layout: 'homeeditor'
  });
});

router.post('/denyPost', restrict, Authories, async function (req, res) {
  const IsDelete = 0;
  const IdPostDenied = 3;
  const DatetimeApproval = moment().format('YYYY-MM-DD HH:mm:ss');
  const IdPost = req.body.idPost;
  const Note = req.body.reasonDeny;
  const IdEditor = res.locals.lcAuthUser.IdAccount;
  const categoriesPost = req.body.idCate;

  const IdEditorAccount = await editorModel.LoadIdEditor(IdEditor, categoriesPost);
  const ValueOfFeedback = ['Note', 'Status', 'DatetimeApproval', 'IdEditorAccount', 'IdPost', 'IsDelete', `${Note}`, `${IdPostDenied}`, `${DatetimeApproval}`, `${IdEditorAccount[0].id}`, `${IdPost}`, `${IsDelete}`];
  const result = await editorModel.InsertFeedbackPost(ValueOfFeedback);
  const entity = {
    Id: IdPost,
    IdStatus: 3
  }
  const updateStatusPost = await editorModel.UpdateStatusPost(entity);
  var success = false;
  if (result != null) {
    success = true;
  }
  res.redirect('/editor/pending');

});


router.get('/reviewPost/:Id', restrict, Authories, async function (req, res) {
  const list = await editorModel.LoadSinglePost(req.params.Id);
  for (d of list) {
    d.DatePost = moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
  }
  const listTag = await editorModel.LoadTagOfPost(req.params.Id);
  const authorPost = await editorModel.LoadInforPost(req.params.Id);
  res.render('vwEditor/reviewPost', {
    author: authorPost[0],
    IsActivePending: true,
    listTag: listTag,
    reviewPost: list[0],
    empty: list.length === 0,
    layout: 'homeeditor'
  });
});
module.exports = router;