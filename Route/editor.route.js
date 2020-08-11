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


router.get('/', restrict, Authories, async function (req, res) {
  const list = await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
  res.render('vwEditor/index', {
    list,
    err: req.flash('error'),
    success: req.flash('success'),
    layout: 'homeeditor'
  });
});


router.get('/pending', restrict, Authories, async function (req, res) {
  const listCate = await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
  if(listCate.length===0)
  {
    req.flash('error', `Error. You do not have permission to do this yet.`);
    return res.redirect('/editor');
  }
  const idCate = +req.query.cate || listCate[0].IdCategories;
  const listCateSub = await editorModel.LoadCateSub(idCate);
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
  for (p of page_items) {
    p.cate = idCate;
    p.catesub = idCateSub;
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
    err: req.flash('error'),
    success: req.flash('success'),
    empty: list.length === 0,
    layout: 'homeeditor'
  });
});

router.get('/accepted', restrict, Authories, async function (req, res) {
  const listCate = await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
  if(listCate.length===0)
  {
    req.flash('error', `Error. You do not have permission to do this yet.`);
    return res.redirect('/editor');
  }
  const idCate = +req.query.cate || listCate[0].IdCategories;

  const listCateSub = await editorModel.LoadCateSub(idCate);
  const idCateSub = +req.query.catesub || listCateSub[0].Id;
  const IdPostAccepted = 1;
  const page = +req.query.page || 1;
  if (page < 0) page = 1;
  const offset = (page - 1) * config.pagination.limit;
  const [list, total] = await Promise.all([
    editorModel.LoadPostAccept_Limit(IdPostAccepted, idCate, idCateSub, config.pagination.limit, offset),
    editorModel.CountPostAccept(idCate, idCateSub)
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
    d.DatetimePost = moment(d.DatetimePost).format('Do MMMM YYYY, HH:mm:ss');
    if(d.IdStatus==2){
      d.canEdit=false;
    }
    else{
      d.canEdit=true;
    }
  }
  for (p of page_items) {
    p.cate = idCate;
    p.catesub = idCateSub;
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
    err: req.flash('error'),
    success: req.flash('success'),
    empty: list.length === 0,
    layout: 'homeeditor'
  });
});

router.get('/denied', restrict, Authories, async function (req, res) {
  const listCate = await editorModel.LoadCategoriesOfEditor(res.locals.lcAuthUser.Id);
  if(listCate.length===0)
  {
    req.flash('error', `Error. You do not have permission to do this yet.`);
    return res.redirect('/editor');
  }
  const idCate = +req.query.cate || listCate[0].IdCategories;

  const listCateSub = await editorModel.LoadCateSub(idCate);
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

  for (p of page_items) {
    p.cate = idCate;
    p.catesub = idCateSub;
  }
  res.render('vwEditor/listPostDeny', {
    listCate,
    idCate,
    idCateSub,
    listCateSub,
    IsActiveDenied: true,
    listPost: list,
    page_items,
    prev_value: page - 1,
    next_value: page + 1,
    can_go_prev: page > 1,
    can_go_next: page < nPages,
    err: req.flash('error'),
    success: req.flash('success'),
    empty: list.length === 0,
    layout: 'homeeditor'
  });
});


router.get('/deny/:Url', restrict, Authories, async function (req, res) {
  const url=req.params.Url;
  const IdPost=await editorModel.LoadIdPostByUrl(url);
  if(IdPost.length===0)
  {
    res.redirect('/editor/pending');
  }
  const list = await editorModel.LoadInforPost(IdPost[0].Id);
  const categories = await editorModel.LoadCateByIdCateSub(list[0].IdCategories);
  const cateSub = await editorModel.LoadCateSubById(list[0].IdCategories);

  res.render('vwEditor/deny', {
    IsActivePending: true,
    cateSub: cateSub[0],
    categories: categories[0],
    denyPost: list[0],
    empty: list.length === 0,
    layout: 'homeeditor'
  });
});

router.get('/editdeny/:Id', restrict, Authories, async function (req, res) {
  const idPost = req.params.Id;
  const list = await editorModel.LoadInforPost(idPost);
  const categories = await editorModel.LoadCateByIdCateSub(list[0].IdCategories);
  const note = await editorModel.LoadFeedBackOfPosts(idPost);
  res.render('vwEditor/editDenied', {
    note: note[0],
    categories: categories[0],
    IsActiveDenied: true,
    denyPost: list[0],
    empty: list.length === 0,
    layout: 'homeeditor'
  });
});

router.get('/accept/:Url', restrict, Authories, async function (req, res) {
  const url = req.params.Url;
  const IdPost= await editorModel.LoadIdPostByUrl(url);
  if(IdPost.length===0)
  {
    res.redirect('/editor/pending');
  }
  const cate = await editorModel.LoadCateSubOfPost(IdPost[0].Id);
  var listCategoriesSub = await editorModel.LoadCateSub(cate[0].IdCategoriesMain);
  const inforOfPost = await editorModel.LoadSinglePost(url);
  const author = await editorModel.LoadInforPost(IdPost[0].Id);
  for (c of listCategoriesSub) {
    if (c.Id == cate[0].IdCategories) {
      c.isActiveCategories = true;
      break;
    }
  }

  const listTagOfPost = await editorModel.LoadTagOfPost(IdPost[0].Id);
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
    cate: cate[0],
    listCategoriesSub,
    templistTags,
    IsActivePending: true,
    author: author[0],
    inforOfPost: inforOfPost[0],
    empty: listCategoriesSub.length === 0,
    layout: 'homeeditor'
  });
});

router.get('/editaccept/:Url', restrict, Authories, async function (req, res) {
  const url = req.params.Url;
  const IdPost= await editorModel.LoadIdPostByUrl(url);
  if(IdPost.length===0)
  {
    res.redirect('/editor/accepted');
  }
  const cate = await editorModel.LoadCateSubOfPost(IdPost[0].Id);
  var listCategoriesSub = await editorModel.LoadCateSub(cate[0].IdCategoriesMain);
  const inforOfPost = await editorModel.LoadSinglePost(url);
  const author = await editorModel.LoadInforPost(IdPost[0].Id);
  const Premium= await editorModel.LoadPostPremium(IdPost[0].Id);
  var isPremium=true;
  if (Premium.length===0)
  {
    isPremium=false;
  }
  for (c of listCategoriesSub) {
    if (c.Id == cate[0].IdCategories) {
      c.isActiveCategories = true;
      break;
    }
  }
  const listTagOfPost = await editorModel.LoadTagOfPost(IdPost[0].Id);
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
  res.render('vwEditor/editAccept', {
    cate: cate[0],
    isPremium,
    IsActiveAccepted: true,
    listCategoriesSub,
    templistTags,
    author: author[0],
    inforOfPost: inforOfPost[0],
    empty: listCategoriesSub.length === 0,
    layout: 'homeeditor'
  });
});

router.post('/denyPost', restrict, Authories, async function (req, res) {
  try {
    const IsDelete = 0;
    const IdPostDenied = 3;
    const DatetimeApproval = moment().format('YYYY-MM-DD HH:mm:ss');
    const IdPost = req.body.idPost;
    const Note = req.body.reasonDeny;
    const IdEditor = res.locals.lcAuthUser.IdAccount;
    const categoriesPost = req.body.idCate;
    const cateSub = req.body.idCateSub;

    const ValueOfFeedback = ['Note', 'DatetimeApproval', 'IdEditorAccount', 'IdPost', 'IsDelete', `${Note}`, `${DatetimeApproval}`, `${IdEditor}`, `${IdPost}`, `${IsDelete}`];
    await editorModel.InsertFeedbackPost(ValueOfFeedback);
    const entity = {
      Id: IdPost,
      IdStatus: IdPostDenied
    }
    await editorModel.UpdateStatusPost(entity);
    req.flash('success', `Success. The reason for rejection has been noted`)
    res.redirect('/editor/pending/?cate=' + categoriesPost + '&catesub=' + cateSub);
  }
  catch (err) {
    console.log(err);
  }
});

router.post('/editdeny', restrict, Authories, async function (req, res) {
  try {
    const dt_now = moment().format('YYYY-MM-DD HH:mm:ss');
    const IdPost = req.body.idPost;
    const note = req.body.reasonDeny;
    const cate = req.body.idCate;
    const catesub = req.body.idCateSub;
    const fb = await editorModel.LoadFeedBackOfPosts(IdPost);
    if(fb.length===0)
    {
      req.flash('err', `Error. The post is being processed. You cannot do this.`);
      res.redirect('/editor/denied/?cate=' + cate + '&catesub=' + catesub);
    }
    const entity = {
      Id: fb[0].Id,
      Note: note,
      DatetimeApproval: dt_now
    }
    const update_fb = await editorModel.UpdateFeedBackOfPosts(entity);
    req.flash('success', `Success. Your changes have been saved.`);
    res.redirect('/editor/denied/?cate=' + cate + '&catesub=' + catesub);
  }
  catch (err) {
    console.log(err);
  }

});

router.post('/editaccept', restrict, Authories, async function (req, res) {
  try {
    var IdStatus = 1;
    const newListTags = req.body.tags;
    const cate = req.body.cate;
    const IdPost = req.body.IdPost;
    const catesub = req.body.subCate;
    const ScheduleTime = req.body.Schedule;
    const dt_post = new Date(moment(ScheduleTime, 'YYYY-MM-DD HH:mm:ss'));
    const dt_now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    if (dt_post <= dt_now) {
      IdStatus = 2;
    }
    var isPre = req.body.isPremium;
    if (typeof isPre != "undefined") {
      isPre=0;
    }
    const entity = {
      Id: IdPost,
      DatetimePost: ScheduleTime,
      IdCategories: catesub,
      IdStatus: IdStatus
    }
    await editorModel.DeleteTagsOfPost(IdPost);
    const premium_entity = {
      Id: IdPost,
      isPremium: isPre
    }
    await editorModel.UpdateIsPremium(premium_entity);
    for (t of newListTags) {
      const value = ['IdTag', 'IdPost', `${t}`, `${IdPost}`];
      await editorModel.InsertTagsPost(value);
    }
    await editorModel.UpdateStatusPost(entity);
    req.flash('success', `Success. Acceptance has been recorded.`);
    res.redirect('/editor/accepted/?cate=' + cate + '&catesub=' + catesub);
  }
  catch (err) {
    console.log(err);
  }
});

router.post('/acceptPost', restrict, Authories, async function (req, res) {
  try {
    const IsDelete = 0;
    var IdStatus = 1;
    const newListTags = req.body.tags;
    const cate = req.body.cate;
    const IdPost = req.body.IdPost;
    const catesub = req.body.subCate;
    const ScheduleTime = req.body.Schedule;
    const dt_post = new Date(moment(ScheduleTime, 'YYYY-MM-DD HH:mm:ss'));
    const dt_now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    if (dt_post <= dt_now) {
      IdStatus = 2;
    }
    const isPremium = req.body.isPremium;
    const entity = {
      Id: IdPost,
      DatetimePost: ScheduleTime,
      IdCategories: catesub,
      IdStatus: IdStatus
    }
    await editorModel.DeleteTagsOfPost(IdPost);
    const premium_entity = {
      Id: IdPost,
      isPremium: 1
    }
    if (typeof isPremium != "undefined") {
      await editorModel.UpdateIsPremium(premium_entity);
    }
    for (t of newListTags) {
      const value = ['IdTag', 'IdPost', `${t}`, `${IdPost}`];
      await editorModel.InsertTagsPost(value);
    }
    await editorModel.UpdateStatusPost(entity);
    req.flash('success', `Success. Acceptance has been recorded.`);
    res.redirect('/editor/pending/?cate=' + cate + '&catesub=' + catesub);
  }
  catch (err) {
    console.log(err);
  }
});


router.get('/deleteaccept', restrict, Authories, async function (req, res) {
  const idPost = req.query.id;
  const cate = req.query.cate;
  const catesub = req.query.catesub;
  const IdStatus = 4;
  const entity = {
    Id: idPost,
    DatetimePost: null,
    IdStatus
  }
  const premium_entity = {
    Id: idPost,
    isPremium: 0
  }
  await editorModel.UpdateIsPremium(premium_entity);
  await editorModel.UpdateStatusPost(entity);
  req.flash('success', `Success. The article has moved to the review pending list.`);
  res.redirect('/editor/accepted/?cate=' + cate + '&catesub=' + catesub);

});

router.get('/deletedeny', restrict, Authories, async function (req, res) {
  const idPost = req.query.id;
  const cate = req.query.cate;
  const catesub = req.query.catesub;
  const IdStatus = 4;
  const entity = {
    Id: idPost,
    IdStatus
  }
  await editorModel.UpdateStatusPost(entity);
  const fb = await editorModel.LoadFeedBackOfPosts(idPost);
  if (fb.length === 0) {
    req.flash('err', `Error. The post is being processed. You cannot do this.`);
    res.redirect('/editor/denied/?cate=' + cate + '&catesub=' + catesub);
  }
  for (i of fb) {
    await editorModel.DeleteFeedBackOfPosts(i.Id);
  }
  req.flash('success', `Success. The article has moved to the review pending list.`);
  res.redirect('/editor/denied/?cate=' + cate + '&catesub=' + catesub);

});


router.get('/reviewPost/:Url', restrict, Authories, async function (req, res) {
  try{
    const url = req.params.Url;
    const list = await editorModel.LoadSinglePost(url);
    for (d of list) {
      d.DatePost = moment(d.DatePost).format('Do MMMM YYYY, HH:mm:ss');
    }
    const listTag = await editorModel.LoadTagOfPost(list[0].Id);
    const authorPost = await editorModel.LoadInforPost(list[0].Id);
    const cateSub = await editorModel.LoadCateSubOfPost(list[0].Id);
    const cate = await editorModel.LoadCateFromIdCateSub(cateSub[0].IdCategories);
    res.render('vwEditor/reviewPost', {
      author: authorPost[0],
      cateSub: cateSub[0],
      cate: cate[0],
      IsActivePending: true,
      listTag: listTag,
      reviewPost: list[0],
      empty: list.length === 0,
      layout: 'homeeditor'
    });}
    catch(err)
    {
      console.log(err);
    }
  
});
module.exports = router;