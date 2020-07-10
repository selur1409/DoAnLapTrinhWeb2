const express = require('express');
const postModel = require('../models/post.model');
const tagModel = require('../models/tag.model');



const router = express.Router();

// Trang index
router.get('/',async function (req, res) {

    const listTreding = await postModel.trending();
    const listMostView = await postModel.mostview();
    const listPostNew = await postModel.postnew();
    const listCatPostNew = await postModel.categorypostnew();
    const listTag = await tagModel.all();



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
            }
        }

    });

}) 

// router.get('/:id', function(req, res){
//     res.render('vwPost/detailPost', {
//         layout: 'home'
//     })
// });


module.exports = router;
