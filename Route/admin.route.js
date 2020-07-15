const express = require('express');
const categoryModel = require('../models/category.model');
const tagModel = require('../models/tag.model');
const editoraccountModel = require('../models/editoraccount.model');
const accountModel = require('../models/account.model');
const check = require('../js/check');
const config = require('../config/default.json');
const pageination = require('../js/pagination');
const router = express.Router();

router.get('/', function(req, res){
    return res.render('vwAdmin/index', {
        layout: 'homeadmin'
    });
});

router.get('/categories', async function(req, res){
    try{
        const page = +req.query.page || 1;
        if (page < 0) page = 1;
        const offset = (page - 1) * config.pagination.limit;
       
        const [list, total] = await Promise.all([
            categoryModel.allMain(config.pagination.limit, offset),
            categoryModel.countAllMain()
        ]);
         
        for(c of list){
            const editor = await editoraccountModel.singleManageCat(c.Id);
            c.Manage = editor[0].Name;
        }
     
        const [nPages, page_items] = pageination.page(page, total[0].SoLuong);

        return res.render('vwAdmin/vwCategories/listCategory', {
            layout: 'homeadmin',
            IsActiveCat: true,
            empty: list.length == 0,
            categories: list,
            page_items,
            prev_value: page - 1,
            next_value: page + 1,
            can_go_prev: page > 1,
            can_go_next: page < nPages
        });
    } catch (error) {
        return res.redirect(`/admin/error500`);
    }
});

router.get('/categories/list-of-all', async function(req, res){
    try{
        const page = +req.query.page || 1;
        if (page < 0) page = 1;
        const offset = (page - 1) * config.pagination.limit;
       
        const [list, total] = await Promise.all([
            categoryModel.all(config.pagination.limit, offset),
            categoryModel.countAll()
        ]);
        
        const [nPages, page_items] = pageination.page(page, total[0].SoLuong);
     
        return res.render('vwAdmin/vwCategories/viewAllCategories', {
            layout: 'homeadmin',
            IsActiveCat: true,
            empty: list.length == 0,
            categories: list,
            page_items,
            prev_value: page - 1,
            next_value: page + 1,
            can_go_prev: page > 1,
            can_go_next: page < nPages
        });
        
    } catch (error) {
        return res.redirect('/admin/error500');
    }
});

router.get('/categories/addlv1', async function(req, res){
    const manage = await accountModel.allEditor();

    return res.render('vwAdmin/vwCategories/addCategoryLv1', {
        layout: 'homeAdmin',
        ListManage: manage,
        IsActiveCat: true
    });
});

router.post('/categories/addlv1', async function(req, res){
    const name = check.mark_name(req.body.Name);
    const url = check.mark_url(req.body.Url);
    const manage = req.body.Manage;
    const description = req.body.Description;
    const catMain = await categoryModel.allMain();  
    const ListManage = await accountModel.allEditor();
    if (!name || !url || manage === 'Empty')
    {   
        return res.render('vwAdmin/vwCategories/addCategoryLv1',{
            layout: 'homeAdmin',
            err: 'Mục bắt buộc không được để trống.',
            catMain: catMain,
            ListManage: ListManage,
            IsActiveCat: true
        });
    }

    const isNameMain = await categoryModel.singleNameMain(name);
    const isNameSub = await categoryModel.singleNameSub(name);
    if (isNameMain.length !== 0 || isNameSub.length !== 0)
    {  
        return res.render('vwAdmin/vwCategories/addCategoryLv1',{
            layout: 'homeAdmin',
            err: 'Tên chuyên mục đã tồn tại',
            catMain: catMain,
            ListManage: ListManage,
            IsActiveCat: true
        });
    }

    const isUrlMain = await categoryModel.singleUrlMain(url);
    const isUrlSub = await categoryModel.singleUrlSub(url);
    if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
    {  
        return res.render('vwAdmin/vwCategories/addCategoryLv1',{
            layout: 'homeAdmin',
            err: 'Đường dẫn đã tồn tại',
            catMain: catMain,
            ListManage: ListManage,
            IsActiveCat: true
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

    return res.render('vwAdmin/vwCategories/addCategoryLv1',{
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
            ListManage: ListManage,
            IsActiveCat: true
        });
    }
    
    return res.redirect('/admin/categories');
});

router.post('/categories/edit/:url', async function(req, res){
    const urlParam = req.params.url;
    const idCat = req.body.Id;
    const name = check.mark_name(req.body.Name);
    const url = check.mark_url(req.body.Url);
    const idManage = req.body.Manage;
    const description = req.body.Description;
    
    if (!name || idManage === 'Empty')
    {
        return res.redirect(`/admin/categories/${urlParam}`);
    }
    const isNameMain = await categoryModel.singleNameMainEdit(name, idCat);
    const isNameSub = await categoryModel.singleNameSub(name);

    if (isNameMain.length !== 0 || isNameSub.length !== 0)
    {  
        return res.send('Tên chuyên mục sửa đã tồn tại!');
    }

    const isUrlMain = await categoryModel.singleUrlMainEdit(url, idCat);
    const isUrlSub= await categoryModel.singleUrlSub(url);

    if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
    {  
        return res.send('Đường dẫn tĩnh của chuyên mục sửa đã tồn tại!');
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

// xóa category (update IsDelete = 1)
router.post('/categories/dellv1', async function(req, res){
    const id = req.body.Id;
    const rows = await categoryModel.allSub_Id(id);
    if (rows.length !== 0){
        for (row of rows){
            await categoryModel.ProvisionSub(row.Id);
        }
    }
    await categoryModel.ProvisionMain(id);
    
    return res.redirect('/admin/categories');
});

// kích hoạt category (IsDelete = 0) lv1
router.get('/categories/activatelv1', async function (req, res){
    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const offset = (page - 1) * config.pagination.limit;
   
    const [list, total] = await Promise.all([
        categoryModel.allMainProvisional(config.pagination.limit, offset),
        categoryModel.countAllMainProvisional()
    ]);
    
    for(c of list){
        const editor = await editoraccountModel.singleManageCat(c.Id);
        c.Manage = editor[0].Name;
    }
    const [nPages, page_items] = pageination.page(page, total[0].SoLuong);
       
    return res.render('vwAdmin/vwCategories/activateCategoryLv1', {
        layout: 'homeadmin',
        IsActiveCat: true,
        empty: list.length == 0,
        categories: list,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages
    });
});

router.post('/categories/activatelv1', async function (req, res){
    const id = req.body.Id;

    const list = await categoryModel.singleIdMain_Provision(id);
    if (list.length === 0){
        return res.send('Lỗi không có chuyên mục để kích hoạt');
    }
    const cat = list[0];

    const isNameMain = await categoryModel.singleNameMainEdit(cat.Name, cat.Id);
    const isNameSub = await categoryModel.singleNameSub(cat.Name);

    if (isNameMain.length !== 0 || isNameSub.length !== 0)
    {  
        return res.send('Tên chuyên mục cần kích hoạt đã tồn tại.');
    }

    const isUrlMain = await categoryModel.singleUrlMainEdit(cat.Url, cat.Id);
    const isUrlSub= await categoryModel.singleUrlSub(cat.Url);

    if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
    {  
        return res.send('Đường dẫn tĩnh của chuyên mục kích hoạt đã tồn tại!');
    }
    
    await categoryModel.activateMain(id);
    
    return res.redirect('/admin/categories/activatelv1');
});

router.get('/categories/views/:url', async function(req, res){
    const url = req.params.url;
    const rows = await categoryModel.singleUrlMain(url);
    if (rows.length === 0){
        res.redirect('/admin/categories');
    }
    const cat = rows[0];

    const manage = await editoraccountModel.singleManageCat(cat.Id);

    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const offset = (page - 1) * config.pagination.limit;
   
    const [list, total] = await Promise.all([
        categoryModel.allSub_Id(cat.Id, config.pagination.limit, offset),
        categoryModel.countAllSub_Id(cat.Id)
    ]);
    
    for(l of list){
        const nameMain = await categoryModel.getNameMain(l.Id);
        
        l.NameMain = nameMain[0].Name;
        l.UrlMain = cat.Url;
    }
    const [nPages, page_items] = pageination.page(page, total[0].SoLuong);
       
    return res.render('vwAdmin/vwCategories/viewCategorySub',{
        layout: 'homeAdmin',
        Name: cat.Name,
        UrlMain: cat.Url,
        Manage: manage[0],
        categories: list,
        empty: list.length === 0,
        IsActiveCat: true,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages
    });
});

router.post('/categories/dellv2/:Url', async function(req, res){
    const id = req.body.Id;
    const url = req.params.Url;
    
    await categoryModel.ProvisionSub(id);
    
    return res.redirect(`/admin/categories/views/${url}`);
});

router.get('/categories/activatelv2/:Url', async function (req, res){
    const url = req.params.Url;
    const rows = await categoryModel.singleUrlMain(url);
    if (rows.length === 0){
        return res.redirect('/admin/categories');
    }
    const cat = rows[0];

    const manage = await editoraccountModel.singleManageCat(cat.Id);


    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const offset = (page - 1) * config.pagination.limit;
   
    const [list, total] = await Promise.all([
        categoryModel.allSub_Id_Provisional(cat.Id, config.pagination.limit, offset),
        categoryModel.countAllSub_Id_Provisional(cat.Id)
    ]);
    
    for(l of list){
        const nameMain = await categoryModel.getNameMain(l.Id);
        
        l.NameMain = nameMain[0].Name;
        l.UrlMain = cat.Url;
    }
    const [nPages, page_items] = pageination.page(page, total[0].SoLuong);


    return res.render('vwAdmin/vwCategories/activateCategoryLv2',{
        layout: 'homeAdmin',
        Name: cat.Name,
        UrlMain: cat.Url,
        Manage: manage[0],
        categories: list,
        empty: list.length === 0,
        IsActiveCat: true,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages
    });
});

router.post('/categories/activatelv2/:Url', async function (req, res){
    const url = req.params.Url;
    const rows = await categoryModel.singleUrlMain(url);
    if (rows.length === 0){
        return res.redirect('/admin/categories');
    }
    if (rows[0].IsDelete === 1){
        return res.redirect('/admin/categories');
    }

    const id = req.body.Id;
    const list = await categoryModel.singleIdSub_Provision(id);
    if (list.length === 0){
        return res.redirect('/admin/categories');
    }
    const cat = list[0];
    
    const isNameSub = await categoryModel.singleNameSubEdit(cat.Name, cat.Id);
    const isNameMain = await categoryModel.singleNameMain(cat.Name);

    if (isNameMain.length !== 0 || isNameSub.length !== 0)
    {  
        return res.send('Tên chuyên mục cần kích hoạt đã tồn tại.');
    }

    const isUrlSub = await categoryModel.singleUrlSubEdit(cat.Url, cat.Id);
    const isUrlMain= await categoryModel.singleUrlMain(cat.Url);

    if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
    {  
        return res.send('Đường dẫn tĩnh của chuyên mục kích hoạt đã tồn tại!');
    }

    await categoryModel.activateSub(id);
    
    return res.redirect(`/admin/categories/activatelv2/${url}`);
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

    return res.render('vwAdmin/vwCategories/addCategoryLv2', {
        layout: 'homeAdmin',
        catMain: catMain,
        ListManage: manage,
        url: url,
        Category: isUrlMain[0],
        ManageCat: manageCat[0],
        IsActiveCat: true
    });
});

router.post('/categories/addlv2/:url', async function(req, res){
    const urlParams = req.params.url;

    const name = check.mark_name(req.body.Name);
    const url = check.mark_url(req.body.Url);

    if (!name || !url){
        return res.send('Mục bắt buộc không được để trống');
    }

    const isNameMain = await categoryModel.singleNameMain(name);
    const isNameSub = await categoryModel.singleNameSub(name);
    if (isNameMain.length !== 0 || isNameSub.length !== 0)
    {  
        return res.send('Tên chuyên mục đã tồn tại.');
    }

    const isUrlMain = await categoryModel.singleUrlMain(url);
    const isUrlSub = await categoryModel.singleUrlSub(url);
    if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
    {  
        return res.send('Đường dẫn tĩnh đã tồn tại.');
    }

    const select = req.body.Select;
    const idManage = req.body.IdManage;
    const description = req.body.Description;

    const entity = {
        IdCategoriesMain: parseInt(select),
        Name: name,
        Url: url,
        Description: description,
        IsDelete: 0
    };
    await categoryModel.addSub(entity);

    return res.redirect(`/admin/categories/views/${urlParams}`);
});

router.get('/categories/editlv2/:url', async function (req, res){
    const url = req.params.url;
    const isUrlSub = await categoryModel.singleUrlSub(url);
    if (isUrlSub.length === 0){
        return res.send('Đường dẫn không tồn tại.');
    }

    const isUrlMain = await categoryModel.singleIdMain(isUrlSub[0].IdCategoriesMain);
    if (isUrlMain.length === 0){
        return res.send('Chuyên mục con không có chuyên mục cha.');
    }

    const catMain = await categoryModel.allMain();

    for (c of catMain){
        if (c.Id === isUrlSub[0].IdCategoriesMain){
            c.Selected = true;
        }
    }

    const manageCat = await editoraccountModel.singleManageCat(isUrlMain[0].Id);

    const manage = await accountModel.allEditor();
    for (m of manage){
        if (m.IdAccount === manageCat[0].IdAccount){
            m.SelectedManage = true;
        }
    }
    
    return res.render('vwAdmin/vwCategories/editCategoryLv2',{
        layout: 'homeAdmin',
        Url: isUrlMain[0].Url,
        Name: isUrlMain[0].Name,
        catMain: catMain,
        ListManage: manage,
        Category: isUrlSub[0],
        ManageCat: manageCat[0],
        IsActiveCat: true
    });
});
router.post('/categories/editlv2/:url', async function (req, res){
    const urlParam = req.params.url;
    const catSub = await categoryModel.singleUrlSub(urlParam);
    if (catSub.length === 0){
        return res.send(`Đường dẫn ${urlParam} không tồn tại.`);
    }

    const catMain = await categoryModel.singleIdMain(catSub[0].IdCategoriesMain);
    if (catMain.length === 0){
        return res.send('Chuyên mục con không có chuyên mục cha.');
    }

    const id = req.body.Id;
    const name = check.mark_name(req.body.Name);
    const url = check.mark_url(req.body.Url);
    
    if (!name || !url){
        return res.send('Mục bắt buộc không được để trống.');
    }

    const isNameMain = await categoryModel.singleNameMain(name);
    const isNameSub= await categoryModel.singleNameSubEdit(name, id);
    
    if (isNameMain.length !== 0 || isNameSub.length !== 0)
    {  
        return res.send('Tên chuyên mục sửa đã tồn tại!');
    }
    
    const isUrlMain = await categoryModel.singleUrlMain(url);
    const isUrlSub= await categoryModel.singleUrlSubEdit(url, id);

    if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
    {
        return res.send('Đường dẫn tĩnh của chuyên mục sửa đã tồn tại!');
    }

    const idCategoriesMain = req.body.Select;
    const description = req.body.Description;

    const entity = {
        Id: parseInt(id),
        IdCategoriesMain: parseInt(idCategoriesMain),
        Name: name,
        Url: url,
        Description: description,
        IsDelete: 0
    };
    await categoryModel.patchSub(entity);

    return res.redirect(`/admin/categories/views/${catMain[0].Url}`);
});


router.get('/tags', async function(req, res){
    const list = await tagModel.all();
    return res.render('vwAdmin/vwTags/listTag', {
        layout: 'homeadmin',
        IsActiveTag: true,
        tags: list
    });
});

router.get('/posts', function(req, res){
    return res.render('vwAdmin/vwPosts/listPost', {
        layout: 'homeadmin',
        IsActivePos: true
    });
});

router.get('/account', function(req, res){
    return res.render('vwAdmin/vwAccount/listAccount', {
        layout: 'homeadmin',
        IsActiveAcc: true
    });
});

module.exports = router;