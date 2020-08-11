const config = require('../config/default.json');
const express = require('express');
const postModel = require('../models/post.model');
const tagModel = require('../Models/tag.model');
const commentModel = require('../Models/comment.model');
const moment = require('moment');
const { restrict } = require('../middlewares/auth.mdw');
const categoriesModel = require('../models/category.model');
const router = express.Router();

// Trang index
router.get('/',async function (req, res) {

    const listTreding = await postModel.trending();
    const listMostView = await postModel.mostview();
    const listPostNew = await postModel.postnew();
    const listCatPostNew = await postModel.categorypostnew();
    const listTag = await tagModel.listTagHome();

    const listRandomSidebar = await postModel.postRandomSideBar();
    const listFutureEvent = await postModel.furuteEvents();


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
    for(let i = 0; i < listRandomSidebar.length; i++)
    {
        listRandomSidebar[i].DatetimePost = moment(listRandomSidebar[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    for(let i = 0; i < listFutureEvent.length; i++)
    {
        listFutureEvent[i].DatetimePost = moment(listFutureEvent[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
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

        listRandomSidebar, 
        listFutureEvent,
        emptyFutureEvent: listFutureEvent.length === 0,
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
            loadListRandomSideBar_1: function(context, options)
            {
                let ret = "";
                for(let i = 0; i < 4; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_2: function(context, options)
            {
                let ret = "";
                for(let i = 4; i < 8; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_3: function(context, options)
            {
                let ret = "";
                for(let i = 8; i < 12; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            },
            convertMonth: function(value)
            {
                     if(value == 1) return "Jan";
                else if(value == 2) return "Feb";
                else if(value == 3) return "Mar";
                else if(value == 4) return "Apr";
                else if(value == 5) return "May";
                else if(value == 6) return "Jun";
                else if(value == 7) return "Jul";
                else if(value == 8) return "Aug";
                else if(value == 9) return "Sep";
                else if(value == 10) return "Oct";
                else if(value == 11) return "Nov";
                else if(value == 12) return "Dec";
                else return "?";
            }
        }

    });

}) 


router.get('/detail/premium/:Url', restrict, async function(req, res){
    const dt_now = moment().format('YYYY-MM-DD HH:mm:ss');
    if ((!req.session.authAccount.DateExpired || isNaN(Date.parse(req.session.authAccount.DateExpired))) 
        && res.locals.lcAuthUser.TypeAccount === 1)
        return res.redirect(`/premium/register?retUrl=${req.originalUrl}`);

    const dateEx =  moment(req.session.authAccount.DateExpired, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');


    if(dateEx <= dt_now && res.locals.lcAuthUser.TypeAccount === 1)
        return res.redirect(`/premium/register?retUrl=${req.originalUrl}`);









    const url = req.params.Url;
    const rows = await postModel.single(url);

    const post = rows[0];
    const postRandom = await postModel.postRandomByCategories(post.IdCategories, post.Id);
    const listRandomSidebar = await postModel.postRandomSideBar();
    const listFutureEvent = await postModel.furuteEvents();
    
    const listPostTags = await postModel.postTags();
    

    const listTag = await tagModel.tagByIdPost(post.Id);
    const listComment = await commentModel.commentByIdPost(post.Id);
    const countComment = listComment.length;
    for(let i = 0; i < postRandom.length; i++)
    {
        postRandom[i].DatetimePost = moment(postRandom[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for(let i = 0; i < listRandomSidebar.length; i++)
    {
        listRandomSidebar[i].DatetimePost = moment(listRandomSidebar[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    for(let i = 0; i < listFutureEvent.length; i++)
    {
        listFutureEvent[i].DatetimePost = moment(listFutureEvent[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }

    res.render('vwPost/detailPost', {
        layout: 'detailpost',
        post,
        listTag,
        postRandom,
        listComment,
        countComment,
        emptyPostRandom: postRandom.length === 0,
        listPostTags,
        listRandomSidebar,
        listFutureEvent,
        emptyFutureEvent: listFutureEvent.length === 0,
        helpers:{
            load_list_tags: function(context, Id, options)
            {
                let ret = "";
                let count = 0;
                for(let i = 0; i < context.length; i++)
                {
                    //console.log(context[i].Id);
                    //console.log(context[i]);
                    if(context[i].IdPost === Id && count < 3)
                    {
                        ret = ret + options.fn(context[i]);
                        count++;
                    }
                }
                return ret;
            },
            loadListRandomSideBar_1: function(context, options)
            {
                let ret = "";
                for(let i = 0; i < 4; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_2: function(context, options)
            {
                let ret = "";
                for(let i = 4; i < 8; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_3: function(context, options)
            {
                let ret = "";
                for(let i = 8; i < 12; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            },
            convertMonth: function(value)
            {
                     if(value == 1) return "Jan";
                else if(value == 2) return "Feb";
                else if(value == 3) return "Mar";
                else if(value == 4) return "Apr";
                else if(value == 5) return "May";
                else if(value == 6) return "Jun";
                else if(value == 7) return "Jul";
                else if(value == 8) return "Aug";
                else if(value == 9) return "Sep";
                else if(value == 10) return "Oct";
                else if(value == 11) return "Nov";
                else if(value == 12) return "Dec";
                else return "?";
            }
        }
    })



});



router.get('/detail/:Url', async function(req, res){
    const url = req.params.Url;
    const rows = await postModel.single(url);

    const post = rows[0];
    const postRandom = await postModel.postRandomByCategories(post.IdCategories, post.Id);

    const listTag = await tagModel.tagByIdPost(post.Id);
    const listComment = await commentModel.commentByIdPost(post.Id);

    const listPostTags = await postModel.postTags();
    const countComment = listComment.length;

    const listRandomSidebar = await postModel.postRandomSideBar();
    const listFutureEvent = await postModel.furuteEvents();

    for(let i = 0; i < postRandom.length; i++)
    {
        postRandom[i].DatetimePost = moment(postRandom[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for(let i = 0; i < listRandomSidebar.length; i++)
    {
        listRandomSidebar[i].DatetimePost = moment(listRandomSidebar[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    for(let i = 0; i < listFutureEvent.length; i++)
    {
        listFutureEvent[i].DatetimePost = moment(listFutureEvent[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }

    res.render('vwPost/detailPost', {
        layout: 'detailpost',
        post,
        listTag,
        postRandom,
        listComment,
        countComment,
        emptyPostRandom: postRandom.length === 0,
        listPostTags,
        listRandomSidebar,
        listFutureEvent,
        emptyFutureEvent: listFutureEvent.length === 0,
        helpers:{
            load_list_tags: function(context, Id, options)
            {
                let ret = "";
                let count = 0;
                for(let i = 0; i < context.length; i++)
                {
                    //console.log(context[i].Id);
                    //console.log(context[i]);
                    if(context[i].IdPost === Id && count < 3)
                    {
                        ret = ret + options.fn(context[i]);
                        count++;
                    }
                }
                return ret;
            },
            loadListRandomSideBar_1: function(context, options)
            {
                let ret = "";
                for(let i = 0; i < 4; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_2: function(context, options)
            {
                let ret = "";
                for(let i = 4; i < 8; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_3: function(context, options)
            {
                let ret = "";
                for(let i = 8; i < 12; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            },
            convertMonth: function(value)
            {
                     if(value == 1) return "Jan";
                else if(value == 2) return "Feb";
                else if(value == 3) return "Mar";
                else if(value == 4) return "Apr";
                else if(value == 5) return "May";
                else if(value == 6) return "Jun";
                else if(value == 7) return "Jul";
                else if(value == 8) return "Aug";
                else if(value == 9) return "Sep";
                else if(value == 10) return "Oct";
                else if(value == 11) return "Nov";
                else if(value == 12) return "Dec";
                else return "?";
            }
        }
    })
});









router.post('/search',async function(req, res){


    const ValueSearch = req.body.searchPost || '';
    //const offset = (page - 1) * config.pagination.limit;
    const offset = 0;
    const [listPost, Total] = await Promise.all([postModel.LoadPostBySearch(config.pagination.limit, offset, ValueSearch), postModel.CountPostSearch(config.pagination.limit, offset, ValueSearch)]);
    // const nPages = Math.ceil(Total[0].Number / config.pagination.limit);
    //     const page_items = [];
    //     let count = 0;
    //     let lengthPagination = 0;
    //     let temp = page;
        

        // while (true) {
        //     if (temp - config.pagination.limitPaginationLinks > 0) {
        //         count++;
        //         temp = temp - config.pagination.limitPaginationLinks;
        //     }
        //     else {
        //         break;
        //     }
        // }
        // if ((count * config.pagination.limitPaginationLinks) + config.pagination.limitPaginationLinks >= nPages) {
        //     lengthPagination = nPages;
        // }
        // else {
        //     lengthPagination = (count * config.pagination.limitPaginationLinks) + config.pagination.limitPaginationLinks;
        // }
        // for (let i = (count * config.pagination.limitPaginationLinks) + 1; i <= lengthPagination; i++) {
        //     const item = {
        //         value: i,
        //         isActive: i === page,
        //         IdStatus,
        //         Opt
        //     }
        //     page_items.push(item);
        // }


        //console.log(ValueSearch);
        //console.log(listPost);

        //Total


    console.log(Total);






    
    const listPostTags = await postModel.postTags();

    for(let i = 0; i < listPost.length; i++)
    {
        listPost[i].DatetimePost = moment(listPost[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    
    res.render('vwPost/search', {
        layout: 'listCategoryTag',
        listPost,
        emptyPost: listPost.length === 0,
        listPostTags,
        helpers:{
            load_list_tags: function(context, Id, options)
            {
                let ret = "";
                let count = 0;
                for(let i = 0; i < context.length; i++)
                {
                    //console.log(context[i].Id);
                    //console.log(context[i]);
                    if(context[i].IdPost === Id && count < 3)
                    {
                        ret = ret + options.fn(context[i]);
                        count++;
                    }
                }
                return ret;
            }
        }
    })
});


module.exports = router;

