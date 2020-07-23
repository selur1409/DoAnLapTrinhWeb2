const express = require('express');
const postModel = require('../models/post.model');
const tagModel = require('../Models/tag.model');
const commentModel = require('../Models/comment.model');

const router = express.Router();

// Trang index
router.get('/',async function (req, res) {

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

}) 

router.get('/detail/:Url',async function(req, res){
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

