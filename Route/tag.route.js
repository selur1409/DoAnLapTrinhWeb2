const express = require('express');
const postModel = require('../models/post.model');
const tagModel = require('../Models/tag.model');



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
    res.render('vwTag/postByTag', {
        layout: 'listCategoryTag',
        listPost,
        emptyPost: listPost.length === 0,
        tagName
    })
});


module.exports = router;

