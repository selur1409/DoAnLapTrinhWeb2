const express = require('express');
const postModel = require('../models/post.model');
const tagModel = require('../Models/tag.model');
const moment = require('moment');


const router = express.Router();

// Trang index
router.get('/',async function (req, res) {
    const listTag = await tagModel.all();
    res.render('vwTag/listTag', {
        layout: 'listCategoryTag',
        listTag,
        emptyTag: listTag.length === 0
    })
}) 

router.get('/:TagName',async function(req, res){
    
    const tagName = req.params.TagName;
    const listPost = await postModel.postByTag(tagName);
    const listPostTags = await postModel.postTags();

    for(let i = 0; i < listPost.length; i++)
    {
        listPost[i].DatetimePost = moment(listPost[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    
    res.render('vwTag/postByTag', {
        layout: 'listCategoryTag',
        listPost,
        emptyPost: listPost.length === 0,
        tagName,
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

