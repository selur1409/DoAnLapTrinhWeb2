const express = require('express');
const editorModel = require('../models/editor.model');
const moment = require('moment');
const router = express.Router();
const { restrict } = require('../middlewares/auth.mdw');
const config = require('../config/default.json');
const pageination = require('../js/pagination');

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
  const listCate = await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
  const idCate = +req.query.cate || listCate[0].IdCategories;

  const listCateSub = await editorModel.LoadSubCategories(idCate);
  const idCateSub = +req.query.catesub || listCateSub[0].Id;
  const IdPostPending = 4;
  const page = +req.query.page || 1;
  if (page < 0) page = 1;
  const offset = (page - 1) * config.pagination.limit;
  const [list, total] = await Promise.all([
    editorModel.LoadPostPending_Limit(IdPostPending, idCate, idCateSub, config.pagination.limit, offset),
    editorModel.CountPost(IdPostPending, idCate, idCateSub)
  ]);
  for (c of listCate) {
    if (c.IdCategories == idCate) {
      c.isActiveCate = true;
    }
  }
  for (cs of listCateSub) {
    cs.idCate = idCate;
    if (cs.Id == idCateSub) {
      cs.isActiveCateSub = true;
    }
  }

  const [nPages, page_items] = pageination.page(page, total[0].SoLuong);

  for (d of list) {
    d.DatePost = moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
  }
  res.render('vwEditor/listPostPending', {
    page_items,
    IsActivePending: true,
    listPost: list,
    prev_value: page - 1,
    next_value: page + 1,
    can_go_prev: page > 1,
    can_go_next: page < nPages,
    listCate,
    idCate,
    listCateSub,
    empty: list.length === 0,
    layout: 'homeeditor'
  });
});

router.get('/accepted', restrict, Authories, async function (req, res) {
  const listCate = await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
  const idCate = +req.query.cate || listCate[0].IdCategories;

  const listCateSub = await editorModel.LoadSubCategories(idCate);
  const idCateSub = +req.query.catesub || listCateSub[0].Id;
  const IdPostAccepted = 1;
  const page = +req.query.page || 1;
  if (page < 0) page = 1;
  const offset = (page - 1) * config.pagination.limit;
  const [list, total] = await Promise.all([
    editorModel.LoadPostAccept_Limit(IdPostAccepted, idCate, idCateSub, config.pagination.limit, offset),
    editorModel.CountPost(IdPostAccepted, idCate, idCateSub)
  ]);
  for (c of listCate) {
    if (c.IdCategories == idCate) {
      c.isActiveCate = true;
    }
  }
  for (cs of listCateSub) {
    cs.idCate = idCate;
    if (cs.Id == idCateSub) {
      cs.isActiveCateSub = true;
    }
  }

  const [nPages, page_items] = pageination.page(page, total[0].SoLuong);

  for (d of list) {
    d.DatePost = moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
  }
  res.render('vwEditor/listPostAccept', {
    page_items,
    IsActiveAccepted: true,
    listPost: list,
    prev_value: page - 1,
    next_value: page + 1,
    can_go_prev: page > 1,
    can_go_next: page < nPages,
    listCate,
    idCate,
    listCateSub,
    empty: list.length === 0,
    layout: 'homeeditor'
  });
});

router.get('/denied', restrict, Authories, async function (req, res) {
  const listCate = await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
  const idCate = +req.query.cate || listCate[0].IdCategories;

  const listCateSub = await editorModel.LoadSubCategories(idCate);
  const idCateSub = +req.query.catesub || listCateSub[0].Id;
  const IdPostDenied = 3;
  const page = +req.query.page || 1;
  if (page < 0) page = 1;
  const offset = (page - 1) * config.pagination.limit;
  const [list, total] = await Promise.all([
    editorModel.LoadPostDeny_Limit(IdPostDenied, idCate, idCateSub, config.pagination.limit, offset),
    editorModel.CountPost(IdPostDenied, idCate, idCateSub)
  ]);
  for (c of listCate) {
    if (c.IdCategories == idCate) {
      c.isActiveCate = true;
    }
  }
  for (cs of listCateSub) {
    cs.idCate = idCate;
    if (cs.Id == idCateSub) {
      cs.isActiveCateSub = true;
    }
  }

  const [nPages, page_items] = pageination.page(page, total[0].SoLuong);

  for (d of list) {
    d.DatePost = moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
  }
  res.render('vwEditor/listPostDeny', {
    page_items,
    IsActiveDenied: true,
    listPost: list,
    prev_value: page - 1,
    next_value: page + 1,
    can_go_prev: page > 1,
    can_go_next: page < nPages,
    listCate,
    idCate,
    listCateSub,
    empty: list.length === 0,
    layout: 'homeeditor'
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
  var listCategoriesSub = await editorModel.LoadSubCategories(categories[0].IdCategoriesMain);
  const inforOfPost = await editorModel.LoadSinglePost(IdPost);
  const author = await editorModel.LoadInforPost(IdPost);
  for (c of listCategoriesSub) {
    if (c.Id == categories[0].IdCategories) {
      c.isActiveCategories = true;
      break;
    }
  }

  const listTagOfPost = await editorModel.LoadTagOfPost(IdPost);
  var templistTags = await editorModel.LoadAllTags();
  for (t of templistTags) {
    for (h of listTagOfPost) {
      if (t.Id == h.Id) {
        t.isActiveTags = true;
        break;
      }
      else {
        t.isActiveTags = false;
      }
    }
  }
  res.render('vwEditor/accept', {
    listCategoriesSub,
    templistTags,
    author: author[0],
    inforOfPost: inforOfPost[0],
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
    IdStatus: IdPostDenied
  }
  const updateStatusPost = await editorModel.UpdateStatusPost(entity);
  
  res.redirect('/editor/pending');
});

router.post('/acceptPost', restrict, Authories, async function (req, res) {
  const IsDelete = 0;
  const IdPostAccept = 1;
  const newListTags = req.body.tags;
  const IdPost = req.body.IdPost;
  const SubCate = req.body.subCate;
  const ScheduleTime = req.body.Schedule;
  const entity = {
    Id: IdPost,
    DatetimePost: ScheduleTime,
    IdCategories: SubCate,
    IdStatus: IdPostAccept
  }
  const deleteTagsPost=await editorModel.DeleteTagsOfPost(IdPost);
  const listTagsOfPost = await editorModel.LoadTagOfPost(IdPost);
  for(t of newListTags){
    const value=['IdTag','IdPost',`${t}`,`${IdPost}`];
    await editorModel.InsertTagsPost(value);
  }
  
  const updateStatusPost = await editorModel.UpdateStatusPost(entity);
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