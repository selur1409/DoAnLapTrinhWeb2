const express = require('express');
const postModel = require('../models/post.model');
const tagModel = require('../Models/tag.model');
const commentModel = require('../Models/comment.model');
const moment = require('moment');
const { restrict } = require('../middlewares/auth.mdw');

const router = express.Router();

// Trang index
router.get('/',async function (req, res) {

    const listTreding = await postModel.trending();
    const listMostView = await postModel.mostview();
    const listPostNew = await postModel.postnew();
    const listCatPostNew = await postModel.categorypostnew();
    const listTag = await tagModel.all();


    //console.log(listTreding);

    for(let i = 0; i < listTreding.length; i++)
    {
        listTreding[i].DatetimePost = moment(listTreding[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for(let i = 0; i < listMostView.length; i++)
    {
        listMostView[i].DatetimePost = moment(listMostView[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for(let i = 0; i < listPostNew.length; i++)
    {
        listPostNew[i].DatetimePost = moment(listPostNew[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for(let i = 0; i < listCatPostNew.length; i++)
    {
        listCatPostNew[i].DatetimePost = moment(listCatPostNew[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }



    res.render('index', {
        Treding: listTreding,
        emptyTreding: listTreding.length === 0,

        MostView: listMostView,
        emptyMostView: listMostView.length === 0,

        PostNew: listPostNew,
        emptyPostNew: listPostNew.length === 0,

        CatPostNew: listCatPostNew,
        emptyCatPostNew: listCatPostNew.length === 0,

        listTag: listTag,
        emptyTag: listTag.length === 0,

        helpers: {
            load_Post1: function(context, options)
            {
                return options.fn(context[0]);
            },
            load_Post2: function(context, options)
            {
                let ret = "";
                for(let i = 1; i < context.length; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            },
            load_Premium: function(value)
            {
                if(value == 1)
                    return "public/img/IconPremium.png";
            }
        }

    });

}) 


router.get('/detail/premium/:Url', restrict, async function(req, res){
    
    //const oriURL = "/detail/" + req.params.Url;
    //console.log(oriURL);


    console.log(req.session);
    const dt_now = moment().format('YYYY-MM-DD HH:mm:ss');

    const dateEx =  moment(req.session.authAccount.DateExpired, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');


    const test = moment(req.session.authAccount.DateExpired, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss');

    // console.log(test);

    // console.log(dt_now);
    // console.log(dateEx);


    if(dateEx < dt_now)
        return res.redirect(`/premium/register?retUrl=${req.originalUrl}`);


    const url = req.params.Url;
    const rows = await postModel.single(url);

    const post = rows[0];
    const postRandom = await postModel.postRandomByCategories(post.IdCategories, post.Id);
    const listTag = await tagModel.tagByIdPost(post.Id);
    const listComment = await commentModel.commentByIdPost(post.Id);

    //console.log(req.session);
    //console.log(post);
    //console.log(listComment);

    const countComment = listComment.length;
    res.render('vwPost/detailPost', {
        layout: 'detailpost',
        post,
        listTag,
        postRandom,
        listComment,
        countComment,
        emptyPostRandom: postRandom.length === 0
    })



});



router.get('/detail/:Url', async function(req, res){
    const url = req.params.Url;
    const rows = await postModel.single(url);

    const post = rows[0];
    const postRandom = await postModel.postRandomByCategories(post.IdCategories, post.Id);
    const listTag = await tagModel.tagByIdPost(post.Id);
    const listComment = await commentModel.commentByIdPost(post.Id);

    //console.log(post);
    //console.log(listComment);

    const countComment = listComment.length;
    res.render('vwPost/detailPost', {
        layout: 'detailpost',
        post,
        listTag,
        postRandom,
        listComment,
        countComment,
        emptyPostRandom: postRandom.length === 0
    })
});


module.exports = router;

