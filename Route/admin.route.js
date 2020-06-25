const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/', function(req, res){
    res.render('vwAdmin/index', {
        layout: 'homeadmin'
    })
});

router.get('/categories', function(req, res){
    res.render('vwAdmin/vwCategories/listCategory', {
        layout: 'homeadmin',
        IsActiveCat: true
    })
});

router.get('/tags', function(req, res){    
    res.render('vwAdmin/vwTags/listTag', {
        layout: 'homeadmin',
        IsActiveTag: true
    })
});

router.get('/posts', function(req, res){
    res.render('vwAdmin/vwPosts/listPost', {
        layout: 'homeadmin',
        IsActivePos: true
    })
});


router.get('/account', function(req, res){
    res.render('vwAdmin/vwAccount/listAccount', {
        layout: 'homeadmin',
        IsActiveAcc: true
    })
});


module.exports = router;