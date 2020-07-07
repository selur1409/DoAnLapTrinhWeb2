const express = require('express');
const passport = require('passport');

const categoryModel = require('../models/category.model');
const notification = require('../config/notification.json');

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
    const url = req.params.url;
    const isUrlMain = await categoryModel.singleUrlMain(url);
    if (isUrlMain){
        const catMain = await categoryModel.allMain();
        console.log(catMain);
        
        for (const c of catMain) {
            if (c.Id === isUrlMain.Id) {
                catMain.splice(catMain.indexOf(c), 1);
            }
        }
        console.log(catMain);
        return res.render('vwAdmin/vwCategories/editCategory', {
            layout: 'homeAdmin',
            catMain: catMain,
            isSelectMain: true, 
            Category: isUrlMain
        });
    }
    const isUrlSub = await categoryModel.singleUrlSub(url);
    if (isUrlSub){
        const catMain = await categoryModel.allMain();

        for (const c of catMain) {
            if (c.Id === isUrlSub.IdCategoriesMain) {
                c.isActive = true;
            }
        }
        return res.render('vwAdmin/vwCategories/editCategory', {
            layout: 'homeAdmin',
            catMain: catMain,
            Category: isUrlSub,
            isSelectSub: true
        }); 
    }
    res.redirect('/admin/categories');
});

router.post('/categories/edit/:url', async function(req, res){
    const urlParam = req.params.url;
    const id = req.body.Id;
    const type = req.body.Type;
    const name = req.body.Name;
    const url = req.body.Url;
    const select = req.body.Select;
    const description = req.body.Description;

    if (!name || !url)
    {
        return res.redirect(`/admin/categories/edit/${urlParam}/e1`)
    }

    const isNameMain = await categoryModel.singleNameMainEdit(name, id);
    const isNameSub = await categoryModel.singleNameSubEdit(name, id);
    if (isNameMain || isNameSub)
    {  
        return res.redirect(`/admin/categories/edit/${urlParam}/e2`)
    }

    const isUrlMain = await categoryModel.singleUrlMainEdit(url, id);
    const isUrlSub = await categoryModel.singleUrlSubEdit(url, id);
    if (isUrlMain || isUrlSub){
        return res.redirect(`/admin/categories/edit/${url}/e3`)
    }


    if (type === 'Main'){
        if (select === 'Empty'){      
            const entity = {
                Id: id,
                Name: name,
                Url: url,
                Description: description,
                IsDelete: 0
            };
            await categoryModel.patchMain(entity);
        }
        else{     
            const entity = {
                Name: name,
                Url: url,
                Description: description,
                IdCategoriesMain: parseInt(select),
                IsDelete: 0
            };
            await categoryModel.delMain(id);
            await categoryModel.addSub(entity);
        }

        // load thành công
        const isUrlMainLoad = await categoryModel.singleUrlMain(url);
        if (isUrlMainLoad){
            const catMain = await categoryModel.allMain();
            return res.render('vwAdmin/vwCategories/editCategory', {
                layout: 'homeAdmin',
                catMain: catMain,
                isSelectMain: true, 
                Category: isUrlMainLoad,
                success: "Chỉnh sửa thành công."
            });
        }
        const isUrlSubLoad = await categoryModel.singleUrlSub(url);
        if (isUrlSubLoad){
            const catMain = await categoryModel.allMain();

            for (const c of catMain) {
                if (c.Id === isUrlSubLoad.IdCategoriesMain) {
                    c.isActive = true;
                }
            }
            return res.render('vwAdmin/vwCategories/editCategory', {
                layout: 'homeAdmin',
                catMain: catMain,
                Category: isUrlSubLoad,
                isSelectSub: true,
                success: "Chỉnh sửa thành công."
            }); 
        }

        return res.redirect('/admin/categories');
    }

    if (type === 'Sub'){
        if (select === 'Empty'){ 
            const entity = {
                Name: name,
                Url: url,
                Description: description,
                IsDelete: 0
            };
            await categoryModel.delSub(id);
            await categoryModel.addMain(entity);

            // xử lý khi có khóa ngoại trỏ tới
        }
        else{     
            const entity = {
                Id: id,
                Name: name,
                Url: url,
                Description: description,
                IdCategoriesMain: parseInt(select),
                IsDelete: 0
            };
            await categoryModel.patchSub(entity);
        }

        // load thành công
        const isUrlMainLoad = await categoryModel.singleUrlMain(url);
        if (isUrlMainLoad){
            const catMain = await categoryModel.allMain();
            return res.render('vwAdmin/vwCategories/editCategory', {
                layout: 'homeAdmin',
                catMain: catMain,
                isSelectMain: true, 
                Category: isUrlMainLoad,
                success: "Chỉnh sửa thành công."
            });
        }
        const isUrlSubLoad = await categoryModel.singleUrlSub(url);
        if (isUrlSubLoad){
            const catMain = await categoryModel.allMain();

            for (const c of catMain) {
                if (c.Id === isUrlSubLoad.IdCategoriesMain) {
                    c.isActive = true;
                }
            }
            return res.render('vwAdmin/vwCategories/editCategory', {
                layout: 'homeAdmin',
                catMain: catMain,
                Category: isUrlSubLoad,
                isSelectSub: true,
                err: err,
                success: "Chỉnh sửa thành công."
            }); 
        }

        return res.redirect('/admin/categories');
    }
    

});


router.get('/categories/edit/:url/:notifi', async function(req, res){
    // const q = req.query.url;
    const url = req.params.url;
    const notifi = req.params.notifi;
    var err = undefined;
    var suc = undefined;
    if (notifi === 'e1'){
        err = notification.err.e1;
    }
    else if(notifi === 'e2'){
        err = notification.err.e2;
    }
    else if(notifi === 'e3'){
        err = notification.err.e3;
    }
    else if(notifi === 's1'){
        suc = notification.success.s1;
    }
    else{
        res.redirect(`/categories/edit/${url}`);
    }
    
    const isUrlMain = await categoryModel.singleUrlMain(url);
    if (isUrlMain){
        const catMain = await categoryModel.allMain();
        return res.render('vwAdmin/vwCategories/editCategory', {
            layout: 'homeAdmin',
            catMain: catMain,
            isSelectMain: true, 
            Category: isUrlMain,
            err: err,
            success: suc
        });
    }
    const isUrlSub = await categoryModel.singleUrlSub(url);
    if (isUrlSub){
        const catMain = await categoryModel.allMain();

        for (const c of catMain) {
            if (c.Id === isUrlSub.IdCategoriesMain) {
                c.isActive = true;
            }
        }
        return res.render('vwAdmin/vwCategories/editCategory', {
            layout: 'homeAdmin',
            catMain: catMain,
            Category: isUrlSub,
            isSelectSub: true,
            err: err,
            success: suc
        }); 
    }
    
    res.redirect('/admin/categories');
});

router.post('/categories/del', async function(req, res){
    const url = req.body.Url;
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