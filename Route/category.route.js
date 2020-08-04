const express = require('express');
const postModel = require('../models/post.model');
const categoryModel = require('../Models/category.model');
const moment = require('moment');
const tagModel = require('../Models/tag.model');

const router = express.Router();

// Trang categoy
router.get('/',async function (req, res) {
    const listCat = await categoryModel.allSubCategory();

    //console.log(listCat);
    //console.log(post);

    res.render('vwCategory/listCategory', {
        layout: 'listCategoryTag',
        listCat,
        emptyCat: listCat.length === 0
    })

}) 

router.get('/:Url',async function(req, res){
    const url = req.params.Url;
    const listPost = await postModel.postByCategory(url);
    const listPostTags = await postModel.postTags();

    for(let i = 0; i < listPost.length; i++)
    {
        listPost[i].DatetimePost = moment(listPost[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }

    //console.log(listPostTags);

    res.render('vwCategory/postByCategory', {
        layout: 'listCategoryTag',
        listPost,
        listPostTags,
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
            }
        }
    })
});


module.exports = router;

