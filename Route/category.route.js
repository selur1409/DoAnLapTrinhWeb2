const express = require('express');
const postModel = require('../models/post.model');
const categoryModel = require('../Models/category.model');
const moment = require('moment');
const tagModel = require('../Models/tag.model');

const router = express.Router();

// Trang categoy
router.get('/',async function (req, res) {
    const listCat = await categoryModel.allSubCategory();
    const listRandomSidebar = await postModel.postRandomSideBar();
    const listFutureEvent = await postModel.furuteEvents();


    for(let i = 0; i < listRandomSidebar.length; i++)
    {
        listRandomSidebar[i].DatetimePost = moment(listRandomSidebar[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    for(let i = 0; i < listFutureEvent.length; i++)
    {
        listFutureEvent[i].DatetimePost = moment(listFutureEvent[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    //console.log(listCat);
    //console.log(post);

    res.render('vwCategory/listCategory', {
        layout: 'listCategoryTag',
        listCat,
        emptyCat: listCat.length === 0,
        listRandomSidebar,
        listFutureEvent,
        helpers: {
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

}) 

router.get('/:Url',async function(req, res){
    const url = req.params.Url;
    const listPost = await postModel.postByCategory(url);
    const listPostTags = await postModel.postTags();

    const listRandomSidebar = await postModel.postRandomSideBar();
    const listFutureEvent = await postModel.furuteEvents();


    for(let i = 0; i < listRandomSidebar.length; i++)
    {
        listRandomSidebar[i].DatetimePost = moment(listRandomSidebar[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    for(let i = 0; i < listFutureEvent.length; i++)
    {
        listFutureEvent[i].DatetimePost = moment(listFutureEvent[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    for(let i = 0; i < listPost.length; i++)
    {
        listPost[i].DatetimePost = moment(listPost[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }

    //console.log(listPostTags);

    res.render('vwCategory/postByCategory', {
        layout: 'listCategoryTag',
        listPost,
        listPostTags,
        listRandomSidebar,
        listFutureEvent,
        emptyPost: listPost.length === 0,
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


module.exports = router;

