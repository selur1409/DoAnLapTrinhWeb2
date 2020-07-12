const express = require('express');
const categoryModel = require('../models/category.model');
const tagModel = require('../models/tag.model');
const editoraccountModel = require('../models/editoraccount.model');
const accountModel = require('../models/account.model');
const check = require('../js/check');

const router = express.Router();

router.get('/', function(req, res){
    res.render('vwAdmin/index', {
        layout: 'homeadmin'
    });
});

router.get('/categories', async function(req, res){
    try{
        const list = await categoryModel.allMain();            
        for(c of list){
            const editor = await editoraccountModel.singleManageCat(c.Id);
            c.Manage = editor[0].Name;
        }
        return res.render('vwAdmin/vwCategories/listCategory', {
            layout: 'homeadmin',
            IsActiveCat: true,
            empty: list.length == 0,
            categories: list,
        });
    } catch (error) {
        res.redirect(`/admin/error500`);
    }
});

router.get('/categories/list-of-all', async function(req, res){
    try{
        const list = await categoryModel.all();

        return res.render('vwAdmin/vwCategories/viewAllCategories', {
            layout: 'homeadmin',
            IsActiveCat: true,
            empty: list.length == 0,
            categories: list,
            selectedFull: true
        });
    } catch (error) {
        res.redirect('/admin/error500');
    }
});

router.get('/categories/addlv1', async function(req, res){
    const manage = await accountModel.allEditor();

    res.render('vwAdmin/vwCategories/addCategoryLv1', {
        layout: 'homeAdmin',
        ListManage: manage
    });
});

router.post('/categories/addlv1', async function(req, res){
    const name = check.mark_name(req.body.Name);
    const url = check.mark_url(name);
    const manage = req.body.Manage;
    const description = req.body.Description;
    const catMain = await categoryModel.allMain();  
    const ListManage = await accountModel.allEditor();
    if (!name || manage === 'Empty')
    {   
        return res.render('vwAdmin/vwCategories/addCategoryLv1',{
            layout: 'homeAdmin',
            err: 'Mục bắt buộc không được để trống.',
            catMain: catMain,
            ListManage: ListManage
        });
    }

    const isUrlMain = await categoryModel.singleUrlMain(url);

    if (isUrlMain.length !== 0)
    {  
        return res.render('vwAdmin/vwCategories/addCategoryLv1',{
            layout: 'homeAdmin',
            err: `${url}`,
            catMain: catMain,
            ListManage: ListManage
        });
    }
   
    const entity = {
        Name: name,
        Url: url,
        Description: description,
        IsDelete: 0
    };
    await categoryModel.addMain(entity);

    const idCat = await categoryModel.singleUrlMain(url);

    const entity_Editor = {
        IdAccount: manage,
        IdCategories: idCat[0].Id,
        IsDelete: 0
    };
    await editoraccountModel.add(entity_Editor);

    res.render('vwAdmin/vwCategories/addCategoryLv1',{
        layout: 'homeAdmin',
        success: `Thêm chuyên mục ${name} thành công.`,
        catMain: catMain,
        ListManage: ListManage
    });
});


router.get('/categories/edit/:url', async function(req, res){
    const url = req.params.url;
    const isUrlMain = await categoryModel.singleUrlMain(url);
    if (isUrlMain.length !== 0){
        const ListManage = await accountModel.allEditor();

        const cat = isUrlMain[0];
        const editor = await editoraccountModel.singleManageCat(cat.Id);

        cat.Manage = editor[0].Name;
        cat.IdManage = editor[0].IdAccount;

        for (l of ListManage){
            if (l.IdAccount === cat.IdManage){
                l.SelectedManage = true;
            }
        }

        return res.render('vwAdmin/vwCategories/editCategory', {
            layout: 'homeAdmin',
            Category: cat,
            ListManage: ListManage
        });
    }
    
    res.redirect('/admin/categories');
});

router.post('/categories/edit/:url', async function(req, res){
    const urlParam = req.params.url;
    const idCat = req.body.Id;
    const name = check.mark_name(req.body.Name);
    const url = check.mark_url(name);
    const idManage = req.body.Manage;
    const description = req.body.Description;
    
    if (!name || idManage === 'Empty')
    {
        return res.redirect(`/admin/categories/${urlParam}`);
    }
    const isNameMain = await categoryModel.singleNameMainEdit(name, idCat);
    const isNameSub= await categoryModel.singleNameSubEdit(name, idCat);

    if (isNameMain.length !== 0 || isNameSub.length !== 0)
    {  
        return res.send('Tên chuyên mục sửa đã tồn tại!');
    }
    
    const entity = {
        Id: idCat,
        Name: name,
        Url: url,
        Description: description,
        IsDelete: 0
    };
    
    const idEditor = await editoraccountModel.singleId(idCat);
    if (idEditor.length === 0){
        return res.send('Chỉnh sửa khi chưa có người quản lý chuyên mục đó');
    }

    const entity_editor = {
        Id: idEditor[0].Id,
        IdAccount: idManage,
        IdCategories: idCat
    };


    await categoryModel.patchMain(entity);
    await editoraccountModel.patch(entity_editor);

    // load thành công 
    return res.redirect('/admin/categories');
});

router.post('/categories/del', async function(req, res){
    const url = req.body.Url;
    res.send('del' + " url: " + url);
});

router.get('/categories/views/:url', async function(req, res){
    const url = req.params.url;
    const rows = await categoryModel.singleUrlMain(url);
    if (rows.length === 0){
        res.redirect('/admin/categories');
    }
    const cat = rows[0];

    const manage = await editoraccountModel.singleManageCat(cat.Id);

    const catSub = await categoryModel.allSub_Id(cat.Id);
    for(c of catSub){
        const nameMain = await categoryModel.getNameMain(c.Id);
        
        c.NameMain = nameMain[0].Name;
    }
    res.render('vwAdmin/vwCategories/viewCategorySub',{
        layout: 'homeAdmin',
        Name: cat.Name,
        UrlMain: cat.Url,
        Manage: manage[0],
        categories: catSub,
        empty: catSub.length === 0
    });
});

router.post('/categories/views/:url', function(req, res){
    // xóa
    res.send('ok');
});

router.get('/categories/addlv2/:url', async function(req, res){
    const url = req.params.url;
    const isUrlMain = await categoryModel.singleUrlMain(url);
    if (isUrlMain.length === 0){
        return res.send(`Không có chuyên mục cấp 1: ${url}`);
    }
    
    const catMain = await categoryModel.allMain();
    for(c of catMain){
        if (c.Id === isUrlMain[0].Id){
            c.Selected = true;
        }
    }
    const manageCat = await editoraccountModel.singleManageCat(isUrlMain[0].Id);
    if (manageCat.length === 0){
        return res.send(`Không có người quản lý chuyên mục với đường dẫn: ${url}`);
    }

    const manage = await accountModel.allEditor();
    for (m of manage){
        if (m.IdAccount === manageCat[0].IdAccount){
            m.SelectedManage = true;
        }
    }

    res.render('vwAdmin/vwCategories/addCategoryLv2', {
        layout: 'homeAdmin',
        catMain: catMain,
        ListManage: manage,
        url: url
    });
});

router.post('/categories/addlv2/:url', async function(req, res){
    res.send('Ok');
});


router.get('/tags', async function(req, res){
    const list = await tagModel.all();
    res.render('vwAdmin/vwTags/listTag', {
        layout: 'homeadmin',
        IsActiveTag: true,
        tags: list
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