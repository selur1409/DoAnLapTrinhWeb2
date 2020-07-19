const categoryModel = require('../../models/category.model');
const tagModel = require('../../models/tag.model');
const editoraccountModel = require('../../models/editoraccount.model');
const accountModel = require('../../models/account.model');
const check = require('../../js/check');
const config = require('../../config/default.json');
const pageination = require('../../js/pagination');
const que = require('../../js/query');

module.exports = (router) => {
    //Xem tất cả theo từng chuyên mục
    router.get('/categories', async function(req, res){
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
                c.Manage = editor[0].Name;
            }
         
            const [nPages, page_items] = pageination.page(page, total[0].SoLuong);

            const notify = req.query.notify || "";
            var err = "";
            var success = "";

            for(q of que.notify){
                if (notify === q.value){
                    if (q.type === 'error'){
                        err = q.notify;
                        break;
                    }
                    else if (q.type === 'success'){
                        success = q.notify;
                        break;
                    }
                }
            }    
    
            return res.render('vwAdmin/vwCategories/listCategory', {
                layout: 'homeadmin',
                empty: list.length == 0,
                categories: list,
                page_items,
                prev_value: page - 1,
                next_value: page + 1,
                can_go_prev: page > 1,
                can_go_next: page < nPages,
                err,
                success
            });
        } catch (error) {
            console.log(error);
            return res.redirect(`/admin/categories/err1`);
        }
    })
    // xem tất cả chuyên mục cấp 1 và cấp 2
    router.get('/categories/list-of-all', async function(req, res){
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
            
            const [nPages, page_items] = pageination.page(page, total[0].SoLuong);
         
            return res.render('vwAdmin/vwCategories/viewAllCategories', {
                layout: 'homeadmin',
                empty: list.length == 0,
                categories: list,
                page_items,
                prev_value: page - 1,
                next_value: page + 1,
                can_go_prev: page > 1,
                can_go_next: page < nPages
            })
            
        } catch (error) {
            console.log(error);
            return res.redirect('/admin/categories/err2');
        }
    })
    // thêm chuyên mục cấp 1
    router.get('/categories/addlv1', async function(req, res){
        try{
            for (const c of res.locals.lcManage) {
                if (c.link === 'categories') {
                    c.isActive = true;
                }
            }
            
            const manage = await accountModel.allEditor();
            
            const notify = req.query.notify || "";
            var err = "";
            var success = "";

            for(q of que.notify){
                if (notify === q.value){
                    if (q.type === 'error'){
                        err = q.notify;
                        break;
                    }
                    else if (q.type === 'success'){
                        success = q.notify;
                        break;
                    }
                }
            }
        
            return res.render('vwAdmin/vwCategories/addCategoryLv1', {
                layout: 'homeAdmin',
                ListManage: manage,
                err,
                success
            })
        }
        catch(error){
            console.log(error);
            return res.redirect(`/admin/categories/err3`);
        }
    })
    
    router.post('/categories/addlv1', async function(req, res){
        try{
            const name = check.mark_name(req.body.Name);
            const url = check.mark_url(req.body.Url);
            const manage = req.body.Manage;
            const description = req.body.Description;
            if (!name || !url || manage === 'Empty')
            {   
                return res.redirect('/admin/categories/addlv1?notify=muc-bat-buoc');
            }
        
            const isNameMain = await categoryModel.singleNameMain(name);
            const isNameSub = await categoryModel.singleNameSub(name);
            if (isNameMain.length !== 0 || isNameSub.length !== 0)
            {  
                return res.redirect('/admin/categories/addlv1?notify=ten-ton-tai');
            }
        
            const isUrlMain = await categoryModel.singleUrlMain(url);
            const isUrlSub = await categoryModel.singleUrlSub(url);
            if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
            {  
                return res.redirect('/admin/categories/addlv1?notify=duong-dan-ton-tai');
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
        
            return res.redirect('/admin/categories/addlv1?notify=them-thanh-cong');
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err4');
        }
    })
    
    // sửa chuyên mục cấp 1
    router.get('/categories/edit/:url', async function(req, res){
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
        
                cat.Manage = editor[0].Name;
                cat.IdManage = editor[0].IdAccount;
        
                for (l of ListManage){
                    if (l.IdAccount === cat.IdManage){
                        l.SelectedManage = true;
                    }
                }

                const notify = req.query.notify || "";
                var err = "";
                var success = "";
    
                for(q of que.notify){
                    if (notify === q.value){
                        if (q.type === 'error'){
                            err = q.notify;
                            break;
                        }
                        else if (q.type === 'success'){
                            success = q.notify;
                            break;
                        }
                    }
                }    
        
                return res.render('vwAdmin/vwCategories/editCategory', {
                    layout: 'homeAdmin',
                    Category: cat,
                    ListManage: ListManage,
                    err,
                    success
                })
            }
            
            return res.redirect('/admin/categories');
        }
        catch{
            console.log(error);
            return res.redirect('/admin/categories/err5');
        }
        
    })
    
    router.post('/categories/edit/:url', async function(req, res){
        try{
            const urlParam = req.params.url;
            const idCat = req.body.Id;
            const name = check.mark_name(req.body.Name);
            const url = check.mark_url(req.body.Url);
            const idManage = req.body.Manage;
            const description = req.body.Description;
            
            if (!name || idManage === 'Empty')
            {
                return res.redirect(`/admin/categories/edit/${urlParam}?notify=muc-bat-buoc`);
            }
            const isNameMain = await categoryModel.singleNameMainEdit(name, idCat);
            const isNameSub = await categoryModel.singleNameSub(name);
        
            if (isNameMain.length !== 0 || isNameSub.length !== 0)
            {  
                return res.redirect(`/admin/categories/edit/${urlParam}?notify=ten-ton-tai`);
            }
        
            const isUrlMain = await categoryModel.singleUrlMainEdit(url, idCat);
            const isUrlSub= await categoryModel.singleUrlSub(url);
        
            if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
            {  
                return res.redirect(`/admin/categories/edit/${urlParam}?notify=duong-dan-ton-tai`);
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
                return res.redirect(`/admin/categories/edit/${urlParam}?notify=khong-co-quan-ly`);
            }
        
            const entity_editor = {
                Id: idEditor[0].Id,
                IdAccount: idManage,
                IdCategories: idCat
            };
        
            await categoryModel.patchMain(entity);
            await editoraccountModel.patch(entity_editor);
        
            // load thành công 
            return res.redirect(`/admin/categories/edit/${urlParam}?notify=chinh-sua-thanh-cong`);
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err6'); 
        }       
    })
    
    // xóa category (update IsDelete = 1)
    router.post('/categories/dellv1', async function(req, res){
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
    router.get('/categories/activatelv1', async function (req, res){
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
                c.Manage = editor[0].Name;
            }
            const [nPages, page_items] = pageination.page(page, total[0].SoLuong);

            const notify = req.query.notify || "";
            var err = "";
            var success = "";

            for(q of que.notify){
                if (notify === q.value){
                    if (q.type === 'error'){
                        err = q.notify;
                        break;
                    }
                    else if (q.type === 'success'){
                        success = q.notify;
                        break;
                    }
                }
            }
               
            return res.render('vwAdmin/vwCategories/activateCategoryLv1', {
                layout: 'homeadmin',
                empty: list.length == 0,
                categories: list,
                page_items,
                prev_value: page - 1,
                next_value: page + 1,
                can_go_prev: page > 1,
                can_go_next: page < nPages,
                err,
                success
            })
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err8'); 
        }
    })
    
    router.post('/categories/activatelv1', async function (req, res){
        try{
            const id = req.body.Id;
        
            const list = await categoryModel.singleIdMain_Provision(id);
            if (list.length === 0){
                return res.redirect('/admin/categories/activatelv1?notify=khong-kich-hoat');
            }
            const cat = list[0];
            
            const isNameMain = await categoryModel.singleNameMainEdit(cat.Name, cat.Id);
            const isNameSub = await categoryModel.singleNameSub(cat.Name);
            
            if (isNameMain.length !== 0 || isNameSub.length !== 0)
            {  
                return res.redirect('/admin/categories/activatelv1?notify=ten-kich-hoat-ton-tai');
            }
            
            const isUrlMain = await categoryModel.singleUrlMainEdit(cat.Url, cat.Id);
            const isUrlSub= await categoryModel.singleUrlSub(cat.Url);
            
            if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
            {  
                return res.redirect('/admin/categories/activatelv1?notify=duong-dan-kich-hoat-ton-tai');
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
    router.get('/categories/views/:url', async function(req, res){
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
            const manage = await editoraccountModel.singleManageCat(cat.Id);
        
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
            const [nPages, page_items] = pageination.page(page, total[0].SoLuong);
               
            return res.render('vwAdmin/vwCategories/viewCategorySub',{
                layout: 'homeAdmin',
                Name: cat.Name,
                UrlMain: cat.Url,
                Manage: manage[0],
                categories: list,
                empty: list.length === 0,
                page_items,
                prev_value: page - 1,
                next_value: page + 1,
                can_go_prev: page > 1,
                can_go_next: page < nPages
            })
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err10'); 
        }
    })
    //thêm chuyên mục cấp 2
    router.get('/categories/addlv2/:url', async function(req, res){
        try{
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
            if (manageCat.length === 0){
                return res.redirect('/admin/categories');
            }
        
            const manage = await accountModel.allEditor();
            for (m of manage){
                if (m.IdAccount === manageCat[0].IdAccount){
                    m.SelectedManage = true;
                }
            }

            const notify = req.query.notify || "";
            var err = "";
            var success = "";

            for(q of que.notify){
                if (notify === q.value){
                    if (q.type === 'error'){
                        err = q.notify;
                        break;
                    }
                    else if (q.type === 'success'){
                        success = q.notify;
                        break;
                    }
                }
            }
        
            return res.render('vwAdmin/vwCategories/addCategoryLv2', {
                layout: 'homeAdmin',
                catMain: catMain,
                ListManage: manage,
                url: url,
                Category: isUrlMain[0],
                ManageCat: manageCat[0],
                err, success
            })
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err11'); 
        }
    })
    
    router.post('/categories/addlv2/:url', async function(req, res){
        try{
            const urlParams = req.params.url;
        
            const name = check.mark_name(req.body.Name);
            const url = check.mark_url(req.body.Url);
        
            if (!name || !url){
                return res.redirect(`/admin/categories/addlv2/${urlParams}?notify=muc-bat-buoc`);
            }
        
            const isNameMain = await categoryModel.singleNameMain(name);
            const isNameSub = await categoryModel.singleNameSub(name);
            if (isNameMain.length !== 0 || isNameSub.length !== 0)
            {  
                return res.redirect(`/admin/categories/addlv2/${urlParams}?notify=ten-ton-tai`);
            }
        
            const isUrlMain = await categoryModel.singleUrlMain(url);
            const isUrlSub = await categoryModel.singleUrlSub(url);
            if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
            {  
                return res.redirect(`/admin/categories/addlv2/${urlParams}?notify=duong-dan-ton-tai`);
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
        
            return res.redirect(`/admin/categories/addlv2/${urlParams}?notify=them-thanh-cong`);
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err12'); 
        }
    })
    // sửa chuyên mục cấp 2
    router.get('/categories/editlv2/:url', async function (req, res){
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
            for (m of manage){
                if (m.IdAccount === manageCat[0].IdAccount){
                    m.SelectedManage = true;
                }
            }

            const notify = req.query.notify || "";
            var err = "";
            var success = "";

            for(q of que.notify){
                if (notify === q.value){
                    if (q.type === 'error'){
                        err = q.notify;
                        break;
                    }
                    else if (q.type === 'success'){
                        success = q.notify;
                        break;
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
                ManageCat: manageCat[0],
                err,
                success
            })
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err13'); 
        }
    })

    router.post('/categories/editlv2/:url', async function (req, res){
        try{
            const urlParam = req.params.url;
            const catSub = await categoryModel.singleUrlSub(urlParam);
            if (catSub.length === 0){
                return res.redirect(`/admin/categories/editlv2/${urlParam}`);
            }
            
            const catMain = await categoryModel.singleIdMain(catSub[0].IdCategoriesMain);
            if (catMain.length === 0){
                return res.redirect(`/admin/categories/editlv2/${urlParam}?notify=khong-co-cha`);
            }
            
            const id = req.body.Id;
            const name = check.mark_name(req.body.Name);
            const url = check.mark_url(req.body.Url);
            
            if (!name || !url){
                return res.redirect(`/admin/categories/editlv2/${urlParam}?notify=muc-bat-buoc`);
            }
        
            const isNameMain = await categoryModel.singleNameMain(name);
            const isNameSub= await categoryModel.singleNameSubEdit(name, id);
            
            if (isNameMain.length !== 0 || isNameSub.length !== 0)
            {  
                return res.redirect(`/admin/categories/editlv2/${urlParam}?notify=ten-ton-tai`);
            }
            
            const isUrlMain = await categoryModel.singleUrlMain(url);
            const isUrlSub= await categoryModel.singleUrlSubEdit(url, id);
        
            if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
            {
                return res.redirect(`/admin/categories/editlv2/${urlParam}?notify=duong-dan-ton-tai`);
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
    router.post('/categories/dellv2/:Url', async function(req, res){
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
    router.get('/categories/activatelv2/:Url', async function (req, res){
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
        
        
            const notify = req.query.notify || "";
            var err = "";
            var success = "";

            for(q of que.notify){
                if (notify === q.value){
                    if (q.type === 'error'){
                        err = q.notify;
                        break;
                    }
                    else if (q.type === 'success'){
                        success = q.notify;
                        break;
                    }
                }
            }

            return res.render('vwAdmin/vwCategories/activateCategoryLv2',{
                layout: 'homeAdmin',
                Name: cat.Name,
                UrlMain: cat.Url,
                Manage: manage[0],
                categories: list,
                empty: list.length === 0,
                page_items,
                prev_value: page - 1,
                next_value: page + 1,
                can_go_prev: page > 1,
                can_go_next: page < nPages,
                err,
                success
            })
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/categories/err15'); 
        }
    })
    
    router.post('/categories/activatelv2/:Url', async function (req, res){
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
                return res.redirect(`/admin/categories/activatelv2/${url}?notify=khong-kich-hoat`);
            }
            const cat = list[0];
            
            const isNameSub = await categoryModel.singleNameSubEdit(cat.Name, cat.Id);
            const isNameMain = await categoryModel.singleNameMain(cat.Name);
        
            if (isNameMain.length !== 0 || isNameSub.length !== 0)
            {  
                return res.redirect(`/admin/categories/activatelv2/${url}?notify=ten-kich-hoat-ton-tai`);
            }
        
            const isUrlSub = await categoryModel.singleUrlSubEdit(cat.Url, cat.Id);
            const isUrlMain= await categoryModel.singleUrlMain(cat.Url);
        
            if (isUrlMain.length !== 0 || isUrlSub.length !== 0)
            {  
                return res.redirect(`/admin/categories/activatelv2/${url}?notify=duong-dan-kich-hoat-ton-tai`);
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