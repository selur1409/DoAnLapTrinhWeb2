const express = require('express');
const passport = require('passport');

const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', function(req, res){
    res.render('vwAdmin/index', {
        layout: 'homeadmin'
    })
});

router.get('/categories', async function(req, res){

    const sl = req.query.select;

    if (sl === 'full'){
        const list = await categoryModel.all();
    
        return res.render('vwAdmin/vwCategories/listCategory', {
            layout: 'homeadmin',
            IsActiveCat: true,
            empty: list.length == 0,
            categories: list,
            selectedFull: true
        })
    }
    if (sl === 'main'){
        const list = await categoryModel.allMain();
    
        return res.render('vwAdmin/vwCategories/listCategory', {
            layout: 'homeadmin',
            IsActiveCat: true,
            empty: list.length == 0,
            categories: list,
            selectedMain: true
        })
    }
    if (sl === 'sub'){
        const list = await categoryModel.allSub();
    
        return res.render('vwAdmin/vwCategories/listCategory', {
            layout: 'homeadmin',
            IsActiveCat: true,
            empty: list.length == 0,
            categories: list,
            selectedSub: true
        })
    }

    const list = await categoryModel.all();

    res.render('vwAdmin/vwCategories/listCategory', {
        layout: 'homeadmin',
        IsActiveCat: true,
        empty: list.length == 0,
        categories: list
    });
});


router.get('/categories/add', async function(req, res){
    const catMain = await categoryModel.allMain();

    res.render('vwAdmin/vwCategories/addCategory', {
        layout: 'homeAdmin',
        catMain: catMain
    });
});

router.post('/categories/add', async function(req, res){
    const name = req.body.Name;
    var url = req.body.Url;
    var select = req.body.Select;
    var description = req.body.Description;
    
    if (!name || !url)
    {
        const catMain = await categoryModel.allMain();
        return res.render('vwAdmin/vwCategories/addCategory',{
            layout: 'homeAdmin',
            err: 'Mục bắt buộc không được để trống.',
            catMain: catMain
        });
    }

    const isNameMain = await categoryModel.singleNameMain(name);
    const isNameSub = await categoryModel.singleNameSub(name);
    if (isNameMain || isNameSub)
    {  
        const catMain = await categoryModel.allMain();
        return res.render('vwAdmin/vwCategories/addCategory',{
            layout: 'homeAdmin',
            err: 'Tên chuyên mục đã tồn tại.',
            catMain: catMain
        });
    }

    const isUrlMain = await categoryModel.singleUrlMain(url);
    const isUrlSub = await categoryModel.singleUrlSub(url);
    if (isUrlMain || isUrlSub){
        const catMain = await categoryModel.allMain();
        return res.render('vwAdmin/vwCategories/addCategory',{
            layout: 'homeAdmin',
            err: 'Url đã tồn tại.',
            catMain: catMain
        });
    }

    if (select === 'Empty'){      
        const entity = {
            Name: name,
            Url: url,
            Description: description,
            IsDelete: 0
        };
        await categoryModel.addMain(entity);
    }
    else{        
        const entity = {
            Name: name,
            Url: url,
            Description: description,
            IdCategoriesMain: parseInt(select),
            IsDelete: 0
        };
        await categoryModel.addSub(entity);
    }

    const catMain = await categoryModel.allMain();
    res.render('vwAdmin/vwCategories/addCategory',{
        layout: 'homeAdmin',
        success: `Thêm chuyên mục ${Name} thành công.`,
        catMain: catMain
    });
});

router.get('/categories/edit/:url', async function(req, res){
    // const q = req.query.url;
    const q = req.params.url;
    res.send('edit' + q);
});

router.post('/categories/del', async function(req, res){
    const url = req.body.Url;
    console.log(url);
    res.send('del' + " url: " + url);
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