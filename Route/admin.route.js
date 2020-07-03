const express = require('express');
const passport = require('passport');

const categoryModel = require('../models/category.model');
const notification = require('../config/notification.json');
const { response } = require('express');

const router = express.Router();

router.get('/', function(req, res){
    res.render('vwAdmin/index', {
        layout: 'homeadmin'
    })
});

router.get('/categories', async function(req, res){
    try {
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
            for(c of list){
                c.Manage = 'fsdfsad';
            }
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
            for(c of list){
                const nameMain = await categoryModel.getNameMain(c.Id);
                
                c.NameMain = nameMain[0].Name;
            }
            return res.render('vwAdmin/vwCategories/listCategory', {
                layout: 'homeadmin',
                IsActiveCat: true,
                empty: list.length == 0,
                categories: list,
                selectedSub: true
            })
        }

        res.redirect('/admin/categories?select=main')
        
    } catch (error) {
        res.redirect('/admin/categories?select=main')
    }

});

router.get('/categories/view/:url', async function(req, res){
    const url = req.params.url;
    const cat = await categoryModel.singleUrlMain(url);

    if (!cat){
        res.redirect('/admin/categories?select=main');
    }

    const catSub = await categoryModel.allSub_Id(cat.Id);
    for(c of catSub){
        const nameMain = await categoryModel.getNameMain(c.Id);
        
        c.NameMain = nameMain[0].Name;
    }
    res.render('vwAdmin/vwCategories/viewCategory',{
        layout: 'homeAdmin',
        Name: cat.Name,
        UrlMain: cat.Url,
        categories: catSub,
        empty: catSub.length === 0
    });
})

router.get('/categories/add', async function(req, res){
    const catMain = await categoryModel.allMain();

    res.render('vwAdmin/vwCategories/addCategory', {
        layout: 'homeAdmin',
        catMain: catMain
    });
});

router.get('/categories/add/:url', async function(req, res){
    const url = req.params.url;
    const selectedCat = await categoryModel.singleUrlMain(url);
    if(!selectedCat)
    {
        return res.redirect('/admin/categories/add');
    }

    const catMain = await categoryModel.allMain();
    for(c of catMain){
        if (c.Id === selectedCat.Id){
            c.Selected = true;
        }
    }

    res.render('vwAdmin/vwCategories/addCategory', {
        layout: 'homeAdmin',
        catMain: catMain,
        comback: selectedCat.Url
    });
});

router.post('/categories/add', async function(req, res){
    const name = req.body.Name;
    const url = req.body.Url;
    const select = req.body.Select;
    const description = req.body.Description;
    const comback = req.body.comback;

    const catMain = await categoryModel.allMain();
    if(comback){
        const selectedCat = await categoryModel.singleUrlMain(comback);
        for(c of catMain){
            if (c.Id === selectedCat.Id){
                c.Selected = true;
            }
        }
    }    

    if (!name || !url)
    {
        
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
        return res.render('vwAdmin/vwCategories/addCategory',{
            layout: 'homeAdmin',
            err: 'Tên chuyên mục đã tồn tại.',
            catMain: catMain,
            comback: comback
        });
    }

    const isUrlMain = await categoryModel.singleUrlMain(url);
    const isUrlSub = await categoryModel.singleUrlSub(url);
    if (isUrlMain || isUrlSub){
        return res.render('vwAdmin/vwCategories/addCategory',{
            layout: 'homeAdmin',
            err: 'Url đã tồn tại.',
            catMain: catMain,
            comback: comback
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

    res.render('vwAdmin/vwCategories/addCategory',{
        layout: 'homeAdmin',
        success: `Thêm chuyên mục ${name} thành công.`,
        catMain: catMain,
        comback: comback
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
        const catMain = await categoryModel.allMain();
        if (isUrlMainLoad){
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
        const catMain = await categoryModel.allMain();
        const isUrlMainLoad = await categoryModel.singleUrlMain(url);
        if (isUrlMainLoad){
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