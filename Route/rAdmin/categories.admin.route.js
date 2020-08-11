const categoryModel = require('../../models/category.model');
const tagModel = require('../../models/tag.model');
const editoraccountModel = require('../../models/editoraccount.model');
const accountModel = require('../../models/account.model');
const check = require('../../js/check');
const config = require('../../config/default.json');
const pagination_js = require('../../js/pagination');
const {restrict} = require('../../middlewares/auth.mdw');
const {isAdmin} = require('../../middlewares/auth.mdw');

module.exports = (router) => {
    //Xem tất cả theo từng chuyên mục
    router.get('/categories', restrict, isAdmin, async function(req, res){
       try{
            for (const c of res.locals.lcManage) {
                if (c.link === 'categories') {
                  c.isActive = true;
                }
            }
    
            const page = +req.query.page || 1;
            if (page < 0) page = 1;
            const offset = (page - 1) * config.pagination.limit;
           
            const [list, total] = await Promise.all([
                categoryModel.allMain_Limit(config.pagination.limit, offset),
                categoryModel.countAllMain()
            ]);
             
            for(c of list){
                const editor = await editoraccountModel.singleManageCat(c.Id);
                if (editor.length === 0)
                {
                    c.Manage = 'Chưa có quản lý';
                }
                else{
                    c.Manage = editor[0].Name;
                }
            }
         
            const [page_items, entity] = pagination_js.pageLinks(page, total[0].SoLuong);

            return res.render('vwAdmin/vwCategories/listCategory', {
                layout: 'homeadmin',
                empty: list.length == 0,
                categories: list,
                page_items,
                entity,
                err: req.flash('error'),
                success: req.flash('success')
            });
        } catch (error) {
            console.log(error);
            return res.redirect(`/admin/categories/err1`);
        }
    })
    // xem tất cả chuyên mục cấp 1 và cấp 2
    router.get('/categories/list-of-all', restrict, isAdmin, async function(req, res){
        try{
            for (const c of res.locals.lcManage) {
                if (c.link === 'categories') {
                  c.isActive = true;
                }
            }
    
            const page = +req.query.page || 1;
            if (page < 0) page = 1;
            const offset = (page - 1) * config.pagination.limit;
           
            const [list, total] = await Promise.all([
                categoryModel.all(config.pagination.limit, offset),
                categoryModel.countAll()
            ]);
            
            const [page_items, entity] = pagination_js.pageLinks(page, total[0].SoLuong);
            
            return res.render('vwAdmin/vwCategories/viewAllCategories', {
                layout: 'homeadmin',
                empty: list.length == 0,
                categories: list,
                page_items,
                entity
            })
            
        } catch (error) {
            console.log(error);
            return res.redirect('/admin/categories/err2');
        }
    })
    // thêm chuyên mục cấp 1
    router.get('/categories/addlv1', restrict, isAdmin, async function(req, res){
        try{
            for (const c of res.locals.lcManage) {
                if (c.link === 'categories') {
                    c.isActive = true;
                }
            }
            
            const manage = await accountModel.allEditor();
        
            return res.render('vwAdmin/vwCategories/addCategoryLv1', {
                layout: 'homeAdmin',
                ListManage: manage,
                err: req.flash('error'),
                success: req.flash('success')
            })
        }
        catch(error){
            console.log(error);
            return res.redirect(`/admin/categories/err3`);
        }
    })
    
    router.post('/categories/addlv1', restrict, isAdmin, async function(req, res){
        try{
            const name = check.mark_name(req.body.Name);
            const url = check.mark_url(req.body.Url);
            const manage = req.body.Manage;
            const description = req.body.Description;
            if (!name || !url)
            {   
                req.flash('error', 'Mục bắt buộc chưa được điền.')
                return res.redirect('/admin/categories/addlv1');
            }
        
            const isNameMain = await categoryModel.singleNameMain(name);
            const isNameSub = await categoryModel.singleNameSub(name);
            if (isNameMain.length !== 0 || isNameSub.length !== 0)
            {  
                req.flash('error', 'Tên chuyên mục đã tồn tại')
                return res.redirect('/admin/categories/addlv1');
            }
            
            const isUrlMain = await categoryModel.singleUrlMain(url);
            const isUrlSub = await categoryModel.singleUrlSub(url);
            if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
            {  
                req.flash('error', 'Đường dẫn tĩnh đã tồn tại.')
                return res.redirect('/admin/categories/addlv1');
            }
            
            const entity = {
                Name: name,
                Url: url,
                Description: description,
                IsDelete: 0
            };
            await categoryModel.addMain(entity);
            
            const idCat = await categoryModel.singleUrlMain(url);
            
            if (manage !== 'Empty'){
                const entity_Editor = {
                    IdAccount: manage,
                    IdCategories: idCat[0].Id,
                    IsDelete: 0
                };
                await editoraccountModel.add(entity_Editor);
            }
            
            req.flash('success', `Thêm chuyên mục thành công: ${name}`)
            return res.redirect('/admin/categories/addlv1');
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err4');
        }
    })
    
    // sửa chuyên mục cấp 1
    router.get('/categories/edit/:url', restrict, isAdmin, async function(req, res){
        try{
            for (const c of res.locals.lcManage) {
                if (c.link === 'categories') {
                  c.isActive = true;
                }
            }
        
            const url = req.params.url;
            const isUrlMain = await categoryModel.singleUrlMain(url);
            if (isUrlMain.length !== 0){
                const ListManage = await accountModel.allEditor();
                const cat = isUrlMain[0];
                const editor = await editoraccountModel.singleManageCat(cat.Id);
                if (editor.length !== 0){
                    cat.Manage = editor[0].Name;
                    cat.IdManage = editor[0].IdAccount;
                    for (l of ListManage){
                        if (l.IdAccount === cat.IdManage){
                            l.SelectedManage = true;
                        }
                    }    
                }
                
        
                return res.render('vwAdmin/vwCategories/editCategory', {
                    layout: 'homeAdmin',
                    Category: cat,
                    ListManage: ListManage,
                    err: req.flash('error'),
                    success: req.flash('success')
                })
            }
            
            return res.redirect('/admin/categories');
        }
        catch{
            console.log(error);
            return res.redirect('/admin/categories/err5');
        }
        
    })
    
    router.post('/categories/edit/:url', restrict, isAdmin, async function(req, res){
        try{
            const urlParam = req.params.url;
            const idCat = req.body.Id;
            const name = check.mark_name(req.body.Name);
            const url = check.mark_url(req.body.Url);
            const idManage = req.body.Manage;
            const description = req.body.Description;
            
            if (!name)
            {
                res.flash('error', 'Mục bắt buộc chưa được điền.')
                return res.redirect(`/admin/categories/edit/${urlParam}`);
            }
            const isNameMain = await categoryModel.singleNameMainEdit(name, idCat);
            const isNameSub = await categoryModel.singleNameSub(name);
            
            if (isNameMain.length !== 0 || isNameSub.length !== 0)
            {  
                res.flash('error', 'Tên chuyên mục đã tồn tại')
                return res.redirect(`/admin/categories/edit/${urlParam}`);
            }
            
            const isUrlMain = await categoryModel.singleUrlMainEdit(url, idCat);
            const isUrlSub= await categoryModel.singleUrlSub(url);
            
            if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
            {  
                res.flash('error', 'Đường dẫn tĩnh đã tồn tại.')
                return res.redirect(`/admin/categories/edit/${urlParam}`);
            }
            
            const entity = {
                Id: idCat,
                Name: name,
                Url: url,
                Description: description,
                IsDelete: 0
            };
            
            await categoryModel.patchMain(entity);
            
            const idEditor = await editoraccountModel.singleId(idCat);
            if (idManage !== 'Empty'){
                if (idEditor.length === 0){
                    const entity_editor = {
                        IdAccount: idManage,
                        IdCategories: idCat,
                        IsDelete: 0
                    }
                    await editoraccountModel.add(entity_editor); 
                }
                else{
                    const entity_editor = {
                        Id: idEditor[0].Id,
                        IdAccount: idManage,
                        IdCategories: idCat,
                        IsDelete: 0
                    };
                    await editoraccountModel.patch(entity_editor);
                }
            }
            else{
                if (idEditor.length !== 0){
                    
                    const item = await editoraccountModel.del_notsafe(idEditor[0].Id); 
                }
            }
        
            // load thành công 
            req.flash('success', `Chỉnh sửa chuyên mục thành công: ${name}`)
            return res.redirect(`/admin/categories/edit/${urlParam}`);
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err6'); 
        }       
    })

    // xóa category (update IsDelete = 1)
    router.post('/categories/dellv1', restrict, isAdmin, async function(req, res){
        try{
            const id = req.body.Id;
            const rows = await categoryModel.allSub_Id(id);
            if (rows.length !== 0){
                for (row of rows){
                    await categoryModel.ProvisionSub(row.Id);
                }
            }
            await categoryModel.ProvisionMain(id);
            
            return res.redirect('/admin/categories');
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err7'); 
        }
    })

    // kích hoạt category (IsDelete = 0) lv1
    router.get('/categories/activatelv1', restrict, isAdmin, async function (req, res){
        try{
            for (const c of res.locals.lcManage) {
                if (c.link === 'categories') {
                  c.isActive = true;
                }
            }
        
            const page = +req.query.page || 1;
            if (page < 0) page = 1;
            const offset = (page - 1) * config.pagination.limit;
           
            const [list, total] = await Promise.all([
                categoryModel.allMainProvisional(config.pagination.limit, offset),
                categoryModel.countAllMainProvisional()
            ]);
            
            for(c of list){
                const editor = await editoraccountModel.singleManageCat(c.Id);
                if (editor.length !== 0){
                    c.Manage = editor[0].Name;
                }
                else{
                    c.Manage = "Chưa có quản lý";
                }
            }
            const [page_items, entity] = pagination_js.pageLinks(page, total[0].SoLuong);
               
            return res.render('vwAdmin/vwCategories/activateCategoryLv1', {
                layout: 'homeadmin',
                empty: list.length == 0,
                categories: list,
                page_items,
                entity,
                err: req.flash('error'),
                success: req.flash('success')
            })
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err8'); 
        }
    })
    
    router.post('/categories/activatelv1', restrict, isAdmin, async function (req, res){
        try{
            const id = req.body.Id;
        
            const list = await categoryModel.singleIdMain_Provision(id);
            if (list.length === 0){
                req.flash('error', 'Không có tên chuyên mục.')
                return res.redirect('/admin/categories/activatelv1');
            }
            const cat = list[0];
            
            const isNameMain = await categoryModel.singleNameMainEdit(cat.Name, cat.Id);
            const isNameSub = await categoryModel.singleNameSub(cat.Name);
            
            if (isNameMain.length !== 0 || isNameSub.length !== 0)
            {  
                req.flash('error', 'Trùng tên chuyên mục đã tồn tại.')
                return res.redirect('/admin/categories/activatelv1');
            }
            
            const isUrlMain = await categoryModel.singleUrlMainEdit(cat.Url, cat.Id);
            const isUrlSub= await categoryModel.singleUrlSub(cat.Url);
            
            if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
            {  
                req.flash('error', 'Trùng đường dẫn tĩnh đã tồn tại.')
                return res.redirect('/admin/categories/activatelv1');
            }
            
            await categoryModel.activateMain(id);
            
            return res.redirect('/admin/categories/activatelv1');
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err9'); 
        }
    })

    //////////////////////////////////////////////////////
    ////Chuyên mục cấp 2//////////////////////////////////
    ///////////////////////////////////////////////////////
    
    // xem chuyên mục cấp 2 của chuyên mục cấp 1
    router.get('/categories/views/:url', restrict, isAdmin, async function(req, res){
        try{
            for (const c of res.locals.lcManage) {
                if (c.link === 'categories') {
                  c.isActive = true;
                }
            }
        
            const url = req.params.url;
            const rows = await categoryModel.singleUrlMain(url);
            if (rows.length === 0){
                res.redirect('/admin/categories');
            }
            const cat = rows[0];
            var mg = "Chưa có quản lý";
            const manage = await editoraccountModel.singleManageCat(cat.Id);
            if (manage.length !== 0){
                mg = manage[0].Name;
            }
            const page = +req.query.page || 1;
            if (page < 0) page = 1;
            const offset = (page - 1) * config.pagination.limit;
           
            const [list, total] = await Promise.all([
                categoryModel.allSub_Id_Limit(cat.Id, config.pagination.limit, offset),
                categoryModel.countAllSub_Id(cat.Id)
            ]);
            
            for(l of list){
                const nameMain = await categoryModel.getNameMain(l.Id);
                
                l.NameMain = nameMain[0].Name;
                l.UrlMain = cat.Url;
            }
            const [page_items, entity] = pagination_js.pageLinks(page, total[0].SoLuong);
               
            return res.render('vwAdmin/vwCategories/viewCategorySub',{
                layout: 'homeAdmin',
                Name: cat.Name,
                UrlMain: cat.Url,
                Manage: mg,
                categories: list,
                empty: list.length === 0,
                page_items,
                entity
            })
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err10'); 
        }
    })
    //thêm chuyên mục cấp 2
    router.get('/categories/addlv2/:url', restrict, isAdmin, async function(req, res){
        // try{
            for (const c of res.locals.lcManage) {
                if (c.link === 'categories') {
                  c.isActive = true;
                }
            }
        
            const url = req.params.url;
            const isUrlMain = await categoryModel.singleUrlMain(url);

            if (isUrlMain.length === 0){
                return res.redirect('/admin/categories');
            }
            
            const catMain = await categoryModel.allMain();
            for(c of catMain){
                if (c.Id === isUrlMain[0].Id){
                    c.Selected = true;
                }
            }

            const manageCat = await editoraccountModel.singleManageCat(isUrlMain[0].Id);
            const manage = await accountModel.allEditor();
            var mg = "Chưa có quản lý";
            if (manageCat.length !== 0){
                mg = manageCat[0].Name;
                for (m of manage){
                    if (m.IdAccount === manageCat[0].IdAccount){
                        m.SelectedManage = true;
                    }
                }   
            }
        
            return res.render('vwAdmin/vwCategories/addCategoryLv2', {
                layout: 'homeAdmin',
                catMain: catMain,
                ListManage: manage,
                url: url,
                Category: isUrlMain[0],
                ManageCat: mg,
                err: req.flash('error'),
                success: req.flash('success')
            })
        // }
        // catch(error){
        //     console.log(error);
        //     return res.redirect('/admin/categories/err11'); 
        // }
    })
    
    router.post('/categories/addlv2/:url', restrict, isAdmin, async function(req, res){
        try{
            const urlParams = req.params.url;
        
            const name = check.mark_name(req.body.Name);
            const url = check.mark_url(req.body.Url);
        
            if (!name || !url){
                req.flash('error', 'Mục bắt buộc chưa được điền.')
                return res.redirect(`/admin/categories/addlv2/${urlParams}`);
            }
        
            const isNameMain = await categoryModel.singleNameMain(name);
            const isNameSub = await categoryModel.singleNameSub(name);
            if (isNameMain.length !== 0 || isNameSub.length !== 0)
            {  
                req.flash('error', 'Tên chuyên mục đã tồn tại.')
                return res.redirect(`/admin/categories/addlv2/${urlParams}`);
            }
        
            const isUrlMain = await categoryModel.singleUrlMain(url);
            const isUrlSub = await categoryModel.singleUrlSub(url);
            if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
            {  
                req.flash('error', 'Đường dẫn tĩnh đã tồn tại.')
                return res.redirect(`/admin/categories/addlv2/${urlParams}`);
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
            req.flash('success', `Thêm chuyên mục thành công: ${name}`)
            return res.redirect(`/admin/categories/addlv2/${urlParams}`);
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err12'); 
        }
    })
    // sửa chuyên mục cấp 2
    router.get('/categories/editlv2/:url', restrict, isAdmin, async function (req, res){
        try{
            for (const c of res.locals.lcManage) {
                if (c.link === 'categories') {
                  c.isActive = true;
                }
            }
        
            const url = req.params.url;
            const isUrlSub = await categoryModel.singleUrlSub(url);
            const isUrlMain = await categoryModel.singleIdMain(isUrlSub[0].IdCategoriesMain);
            if (isUrlSub.length === 0 || isUrlMain.length === 0){
                return res.redirect('/admin/categories');
            }
        
            const catMain = await categoryModel.allMain();
        
            for (c of catMain){
                if (c.Id === isUrlSub[0].IdCategoriesMain){
                    c.Selected = true;
                }
            }
        
            const manageCat = await editoraccountModel.singleManageCat(isUrlMain[0].Id);
            const manage = await accountModel.allEditor();
            var mg = "Chưa có quản lý";
            if (manageCat.length !== 0){
                mg = manageCat[0].Name;
                for (m of manage){
                    if (m.IdAccount === manageCat[0].IdAccount){
                        m.SelectedManage = true;
                    }
                }   
            }
            
            return res.render('vwAdmin/vwCategories/editCategoryLv2',{
                layout: 'homeAdmin',
                Url: isUrlMain[0].Url,
                Name: isUrlMain[0].Name,
                catMain: catMain,
                ListManage: manage,
                Category: isUrlSub[0],
                ManageCat: mg,
                err: req.flash('error'),
                success: req.flash('success')
            })
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err13'); 
        }
    })

    router.post('/categories/editlv2/:url', restrict, isAdmin, async function (req, res){
        try{
            const urlParam = req.params.url;
            const catSub = await categoryModel.singleUrlSub(urlParam);
            if (catSub.length === 0){
                return res.redirect(`/admin/categories/editlv2/${urlParam}`);
            }
            
            const catMain = await categoryModel.singleIdMain(catSub[0].IdCategoriesMain);
            if (catMain.length === 0){
                req.flash('error', 'Chuyên mục gốc không tồn tại.')
                return res.redirect(`/admin/categories/editlv2/${urlParam}`);
            }
            
            const id = req.body.Id;
            const name = check.mark_name(req.body.Name);
            const url = check.mark_url(req.body.Url);
            
            if (!name || !url){
                req.flash('error', 'Mục bắt buộc chưa được điền.')
                return res.redirect(`/admin/categories/editlv2/${urlParam}`);
            }
        
            const isNameMain = await categoryModel.singleNameMain(name);
            const isNameSub= await categoryModel.singleNameSubEdit(name, id);
            
            if (isNameMain.length !== 0 || isNameSub.length !== 0)
            {  
                req.flash('error', 'Tên chuyên mục đã tồn tại.')
                return res.redirect(`/admin/categories/editlv2/${urlParam}`);
            }
            
            const isUrlMain = await categoryModel.singleUrlMain(url);
            const isUrlSub= await categoryModel.singleUrlSubEdit(url, id);
        
            if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
            {
                req.flash('error', 'Đường dẫn tĩnh đã tồn tại.')
                return res.redirect(`/admin/categories/editlv2/${urlParam}`);
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
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err14'); 
        }
    })
    // xóa chuyên mục cấp 2 (isDelete = 1)
    router.post('/categories/dellv2/:Url', restrict, isAdmin, async function(req, res){
        try{
            const id = req.body.Id;
            const url = req.params.Url;
            
            await categoryModel.ProvisionSub(id);
            
            return res.redirect(`/admin/categories/views/${url}`);
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/error404'); 
        }
    });
    // kích hoạt lại chuyên mục đã xóa
    router.get('/categories/activatelv2/:Url', restrict, isAdmin, async function (req, res){
        try{
            for (const c of res.locals.lcManage) {
            if (c.link === 'categories') {
                  c.isActive = true;
                }
            }
        
            const url = req.params.Url;
            const rows = await categoryModel.singleUrlMain(url);
            if (rows.length === 0){
                return res.redirect('/admin/categories');
            }
            const cat = rows[0];
        
            const manage = await editoraccountModel.singleManageCat(cat.Id);
            var mg = "Chưa có quản lý";
            if (manage.length !== 0){
                mg = manage[0].Name;
            }
        
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
            const [page_items, entity] = pagination_js.pageLinks(page, total[0].SoLuong);

            return res.render('vwAdmin/vwCategories/activateCategoryLv2',{
                layout: 'homeAdmin',
                Name: cat.Name,
                UrlMain: cat.Url,
                Manage: mg,
                categories: list,
                empty: list.length === 0,
                page_items,
                entity,
                err: req.flash('error'),
                success: req.flash('success')
            })
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err15'); 
        }
    })
    
    router.post('/categories/activatelv2/:Url', restrict, isAdmin, async function (req, res){
        try{
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
                req.flash('error', 'Chuyên mục gốc không tồn tại.')
                return res.redirect(`/admin/categories/activatelv2/${url}`);
            }
            const cat = list[0];
            
            const isNameSub = await categoryModel.singleNameSubEdit(cat.Name, cat.Id);
            const isNameMain = await categoryModel.singleNameMain(cat.Name);
        
            if (isNameMain.length !== 0 || isNameSub.length !== 0)
            {  
                req.flash('error', 'Trùng tên chuyên mục đã tồn tại.')
                return res.redirect(`/admin/categories/activatelv2/${url}`);
            }
        
            const isUrlSub = await categoryModel.singleUrlSubEdit(cat.Url, cat.Id);
            const isUrlMain= await categoryModel.singleUrlMain(cat.Url);
        
            if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
            {  
                req.flash('error', 'Trùng đường dẫn tĩnh đã tồn tại.')
                return res.redirect(`/admin/categories/activatelv2/${url}`);
            }
        
            await categoryModel.activateSub(id);
            
            return res.redirect(`/admin/categories/activatelv2/${url}`);
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err16'); 
        }
    })
}