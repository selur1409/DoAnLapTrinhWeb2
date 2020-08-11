const accountModel = require('../../models/account.model');
const typeModel = require('../../Models/typeaccount.model');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const config = require('../../config/default.json');
const {getTimeBetweenDate} = require('../../js/betweendate');
const {getTime_Minutes} = require('../../js/betweendate');
const {addMinutes}= require('../../config/default.json');

const multer = require('multer');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const path = require('path');
const check = require('../../js/check');
const {filesize} = require('../../config/default.json');
const categoryModel = require('../../Models/category.model');
const editoraccountModel = require('../../Models/editoraccount.model');
const { resolveSoa } = require('dns');
const pagination_js = require('../../js/pagination');
const {restrict} = require('../../middlewares/auth.mdw');
const {isAdmin} = require('../../middlewares/auth.mdw');
module.exports = (router) =>{
    router.get('/accounts', restrict, isAdmin, async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'accounts') {
              c.isActive = true;
            }
        }

        const select = req.query.select || 'subscriber';
        var list = [];
        var total = [];
        var IsActiveWriter = false;
        var IsActiveEditor = false;
        var IsActiveGuest = false;
        var IsActiveSubscriber = false;
        

        const page = +req.query.page || 1;
        if (page < 0) page = 1;
        const offset = (page - 1) * config.pagination.limit;

        if (select === 'subscriber'){
            [list, total] = await Promise.all([
                accountModel.loadFull_select(1, config.pagination.limit, offset),
                accountModel.countFull_Select(1)
            ]);
            IsActiveSubscriber = true;
            for (i = 0; i < list.length; i++){
                if (list[i].DateExpired)
                {
                    console.log(list[i].DateExpired);
                    const dt_exp = new Date(moment(list[i].DateExpired, 'YYYY/MM/DD HH:mm:ss'));
                    const dt_now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
                    // if (dt_exp <= dt_now){
                    //     // so sánh
                    // }
                    list[i].premium = getTimeBetweenDate(dt_now, dt_exp);
                }
            }
        }
        else if (select === 'writer'){
            [list, total] = await Promise.all([
                accountModel.loadFull_select(2, config.pagination.limit, offset),
                accountModel.countFull_Select(2)
            ]);
            IsActiveWriter = true;
            for (i =0; i< list.length; i++){
                list[i].premiumForever = true;
            }
        }
        else if (select === 'editor'){
            [list, total] = await Promise.all([
                accountModel.loadFull_select(3, config.pagination.limit, offset),
                accountModel.countFull_Select(3)
            ]);
            IsActiveEditor = true;
            for (i =0; i< list.length; i++){
                list[i].premiumForever = true;
                list[i].editor = true;
            }
        }
        else{
            return res.redirect('/admin/accounts?select=subscriber');
        }

        for (i = 0; i < list.length; i++){
            list[i].DOB =  moment(list[i].DOB, 'YYYY/MM/DD').format('DD-MM-YYYY');
            list[i].DateRegister =  moment(list[i].DateRegister, 'YYYY/MM/DD HH:mm:ss').format('HH:mm:ss DD-MM-YYYY');
            if (list[i].Sex === 0)
                list[i].Sex = 'Nam';
            else
                list[i].Sex = 'Nữ';

            if (select !== 'writer'){
                delete list[i].Nickname;
            }
        }

        const [page_items, entity] = pagination_js.pageLinks(page, total[0].SoLuong);        
        
        for (p of page_items){
            p.select = select;
        }

        return res.render('vwAdmin/vwAccount/listAccount', {
            layout: 'homeadmin',
            empty: list.length === 0,
            accounts: list,
            IsActiveWriter,
            IsActiveEditor,
            IsActiveGuest,
            IsActiveSubscriber,
            page_items,
            entity,
            err: req.flash('error'),
            success: req.flash('success')
        });
    });

    router.get('/accounts/add/:select', restrict, isAdmin, async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'accounts') {
              c.isActive = true;
            }
        }

        var select = req.params.select;
        if (select !== 'subscriber' && select !== 'writer' && select !== 'editor')
            return res.redirect('/admin/accounts/add/subscriber');

        return res.render('vwAdmin/vwAccount/addAccount', {
            layout: 'homeadmin',
            select: select,
            err: req.flash('error'),
            success: req.flash('success'),
            nickname: select === 'writer'
        });
    });

    router.post('/accounts/add', restrict, isAdmin, async function(req, res){
        const select = req.body.select;
        var item = 1;
        var nick = undefined;
        if (select === 'subscriber'){
            ;
        }
        else if (select === 'writer'){
            item = 2;
            nick = req.body.Nickname || 'No name';
        }
        else if (select === 'editor'){
            item = 3;
        }
        else{
            return res.redirect('/admin/accounts');
        }

        if (!req.body.Name || !req.body.Sex || !req.body.Username || !req.body.Password){
            req.flash('error', 'Have a item don\'t empty.');
            return res.redirect(`/admin/accounts/add/${select}`)
        }

        const rows = await accountModel.singleId(req.body.Username);
    
        if (rows.length !== 0){
            req.flash('error', 'Username already exist.');
            return res.redirect(`/admin/accounts/add/${select}`)
        }
    
        // kiểm tra pw vs confirm pw
        if(req.body.Password !== req.body.Confirm)
        {
            req.flash('error', 'Password doesn\'t match.');
            return res.redirect(`/admin/accounts/add/${select}`)
        }
    
        //moment(req.body.DOB, "DD/MM/YYYY").isValid === false
    
        // Lấy ngày giờ hiện tại
        const dt_now = moment().format('YYYY-MM-DD');
        // gia hạn ngày
        var dob = '1999/01/01';
        if (!isNaN(Date.parse(req.body.DOB))){
            dob =  moment(req.body.DOB, 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
    
        //Nếu ngày hiện tại <= ngày sinh thì thông báo lỗi
        if (dt_now <= dob)
        {
            req.flash('error', 'Date of birth is smaller than the current day.');
            return res.redirect(`/admin/accounts/add/${select}`)
        }    
    
        const pw_hash = bcrypt.hashSync(req.body.Password, config.authentication.saltRounds);
        const entity_account = {
            Username: req.body.Username,
            Password_hash: pw_hash,
            DateRegister: dt_now,
            TypeAccount: item,
            IsDelete: 0
        }
        
        await accountModel.add(entity_account);
    
        const registered = await accountModel.singleId(req.body.Username);
        const id = registered[0].Id;
    
        const entity_information = {
            Name: req.body.Name,
            DOB: dob,
            IdAccount: id,
            Sex: req.body.Sex,
            Nickname: nick
        }
    
        await accountModel.addInfor(entity_information);
    
        req.flash('success', 'Created new account success!!!!');
        return res.redirect(`/admin/accounts/add/${select}`)
    })

    router.get('/accounts/edit/:username', restrict, isAdmin, async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'accounts') {
              c.isActive = true;
            }
        }

        const username = req.params.username;
        const list = await accountModel.singUsername_Expired(username);
        if (list.length === 0){
            return res.redirect('/admin/accounts');
        }

        const account = list[0];
        if (account.TypeAccount !== 2)
        {
            delete account.Nickname;
        }
        
        account.DOB =  moment(account.DOB, 'YYYY-MM-DD').format('DD/MM/YYYY');

        var select = 'subscriber';
        if (account.TypeAccount === 2){
            select = 'writer';
        }
        else if (account.TypeAccount === 3){
            select = 'editor';
        }

        var isGg = false;
        if (account.Avatar){
            if (account.Avatar.indexOf("https://") !== -1){
                isGg = true;
            }
        }
        
        return res.render('vwAdmin/vwAccount/editAccount', {
            layout: 'homeadmin',
            err: req.flash('error'),
            success: req.flash('success'),
            account: account,
            select: select,
            isGg
        });
    });

    router.get('/accounts/is-available', restrict, isAdmin, async function(req, res){
        if (req.query.username){
            const list = await accountModel.singleId_editAccount(req.query.username);
            if (list.length !== 0)
            {
                return res.json(false);
            }
            return res.json(true);
        }
        if (req.query.email && req.query.us){
            // Kiểm tra mail không được trùng
            const mail = await accountModel.singleEmail_US(req.body.Email, req.body.us);
            if(mail.length > 0){
                return res.json(false);
            }
            return res.json(true);
        }
    })
    
    const storage = multer.diskStorage({
        filename: function(req, file, cb){
            // var name = req.body.Name;
            // if (!name){
            //     name = path.basename(req.originalname);
            // }
            cb(null, check.mark_url(file.fieldname) + '-' + Date.now() + path.extname(file.originalname));
        },
        destination: function(req, file, cb){
            var path = './public/img/Avatar';
            // kiểm tra xem đã tạo thư mục chưa, nếu ch thì tạo
            fs.mkdir(path,function(e){
                if(!e || (e && e.code === 'EEXIST')){
                    //do something with contents
                    //console.log(e);
                } else {
                    //debug
                    //console.log(e);
                }
            });

            cb(null, path);
        }
    })
    const upload = multer({storage});

    router.post('/accounts/edit', upload.single('avatar'), async function(req, res){
        const username = req.body.Username;

        // xác thực thông tin đầy đủ

        const select = req.body.Select;

        var item = 1;
        var nick = undefined;

        if (select === 'writer'){
            item = 2;
            nick = req.body.Nickname || 'No name';
        }
        else if (select === 'editor'){
            item = 3;
        }

        const rows = await accountModel.singleId(username);
    
        if (rows.length === 0){
            if (req.file){
                fs.unlinkSync(req.file.path);
            }
            req.flash('error', 'Tài khoản không tồn tại.');
            return res.redirect(`/admin/accounts`);
        }
    
        // Lấy ngày giờ hiện tại
        const dt_now = moment().format('YYYY-MM-DD HH:mm:ss');
        // gia hạn ngày
        var dob = '1990/01/01';
        if (moment(req.body.DOB, "DD/MM/YYYY").isValid === true){
            dob =  moment(req.body.DOB, 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
    
        // Nếu ngày hiện tại <= ngày sinh thì thông báo lỗi
        if (dt_now <= dob)
        {
            if (req.file){
                fs.unlinkSync(req.file.path);
            }
            req.flash('error', 'Ngày sinh phải nhỏ hơn ngày hiện tại');
            return res.redirect(`/admin/accounts/edit/${username}`);
        }

        // Kiểm tra mail không được trùng
        const mail = await accountModel.singleEmail_US(req.body.Email, username);
        if(mail.length > 0){
            if (req.file){
                fs.unlinkSync(req.file.path);
            }
            req.flash('error', 'Email đã tồn tại.');
            return res.redirect(`/admin/accounts/edit/${username}`);
        }


  
        const registered = await accountModel.singleId_editAccount(username);
        const singleInfo = await accountModel.singleId_info_editAccount(registered[0].Id);

        if (singleInfo.length === 0){
            if (req.file){
                fs.unlinkSync(req.file.path);
            }
            req.flash('error', 'Không tìm thấy tài khoản.');
            return res.redirect(`/admin/accounts/edit/${username}`);
        }

        var file = undefined;

        if (singleInfo[0].Avatar){
            if (req.file)
            {
                // lớn hơn 20 MB
                if (req.file.size/filesize > 20)
                {
                    fs.unlinkSync(req.file.path);
                    req.flash('error', `Ảnh đại diện phải nhỏ hơn hoặc bằng 2MB`);
                    return res.redirect('/admin/tags/add');
                }
    
                file = req.file.filename;
            }
            else{
                file = singleInfo[0].Avatar;
            }
        }
        else{
            if (req.file)
            {
                // lớn hơn 20 MB
                if (req.file.size/filesize > 20)
                {
                    fs.unlinkSync(req.file.path);
                    req.flash('error', `Ảnh đại diện phải nhỏ hơn hoặc bằng 2MB`);
                    return res.redirect('/admin/tags/add');
                }
    
                file = req.file.filename;
            }
        }

        var itemSex = 0;
        
        if (req.body.Sex === "true"){
            itemSex = 1;
        }
        
        const entity_information = {
            Id: singleInfo[0].Id,
            Name: req.body.Name,
            Nickname: nick,
            Avatar: file,
            DOB: dob,
            Email: req.body.Email,
            Phone: req.body.Phone,
            IdAccount: registered[0].Id,
            Sex: itemSex
        }
    
        await accountModel.patchInfo(entity_information);
    
        req.flash('success', 'Chỉnh sửa thông tin thành công!!!!');
        return res.redirect(`/admin/accounts/edit/${username}`);
    })

    router.get('/accounts/premium-plus/:username', restrict, isAdmin, async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'accounts') {
              c.isActive = true;
            }
        }

        const user = req.params.username;
        const list = await accountModel.singUsername_Expired(user);

        if (list.length === 0){
            return res.redirect('/admin/accounts?select=subscriber');
        }

        const account = list[0];

        if (account.TypeAccount !== 1)
            return res.redirect('/admin/accounts?select=subscriber');
        
        delete account.Password_hash;
        account.DOB =  moment(account.DOB, 'YYYY/MM/DD').format('DD-MM-YYYY');

        if (account.DateExpired){
            const dt_exp = new Date(moment(account.DateExpired, 'YYYY/MM/DD HH:mm:ss'));
            const dt_now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
            account.premium = getTimeBetweenDate(dt_now, dt_exp);
        }

        const minutes = addMinutes;

        const time = getTime_Minutes(minutes);
        time.value = +minutes || 1;
        
        return res.render('vwAdmin/vwAccount/premiumAccount', {
            layout: 'homeadmin',
            err: req.flash('error'),
            success: req.flash('success'),
            account: account,
            time: time,
            select: 'subscriber'
        });
    })
    
    
    router.post('/accounts/premium-plus', restrict, isAdmin, async function(req, res){
        // const id = +req.body.Id || 0;
        const username = req.body.Username;
        // const typeAccount = +req.body.TypeAccount || 1;

        // if (typeAccount !== 1)
        //     return res.redirect('/admin/accounts?select=subsciberfdsfsdfad');
        const list = await accountModel.singUsername_Expired(username);

        if (list.length === 0){
            return res.redirect('/admin/accounts?select=subsciber');
        }

        // if (list[0].Id !== id){
        //     return res.redirect('/admin/accounts?select=subsciber');
        // }

        const user = list[0];

        if (user.DateExpired)
        {
            const dt_exp = new Date(moment(user.DateExpired, 'YYYY/MM/DD HH:mm:ss'));
            const dt_now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
            user.premium = getTimeBetweenDate(dt_now, dt_exp);
        }

        var date_expired = moment().add(req.body.Time, 'm').format('YYYY:MM:DD H:mm:ss');

        if (user.premium)
        {
            if (!user.premium.Notvalue)
            {
                date_expired = moment(user.DateExpired, 'YYYY/MM/DD HH:mm:ss').add(req.body.Time, 'm').format('YYYY:MM:DD H:mm:ss');
            }
        }   
            
        const entity = {
            Id: user.Id,
            DateExpired: date_expired
        }

        await accountModel.patch(entity);
       
        return res.redirect('/admin/accounts?select=subsciber')
    });

    router.post('/accounts/delete-premium', restrict, isAdmin, async function(req, res){
        const username = req.body.Username;
        
        const list = await accountModel.singUsername_Expired(username);

        
        if (list.length === 0){
            return res.redirect('/admin/accounts?select=subsciber');
        }

        const entity = {
            Id: list[0].Id,
            DateExpired: '1/1/1 00:00:00'
        }
        

        await accountModel.patch(entity);
       
        return res.redirect('/admin/accounts?select=subscriber')
    });

    router.get('/accounts/views/changepassword/:username', restrict, isAdmin, async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'accounts') {
              c.isActive = true;
            }
        }

        const username = req.params.username;
        const list = await accountModel.singleUser_Resetpassword(username);
        if (list.length === 0){
            return res.redirect('/admin/accounts?select=subscriber');
        }

        const account = list[0];
        var select = 'subscriber';
        if (account.TypeAccount === 2){
            select = 'writer';
        }
        else if (account.TypeAccount === 3){
            select = 'editor';
        }
                
        return res.render('vwAdmin/vwAccount/passAccount', {
            layout: 'homeadmin',
            err: req.flash('error'),
            success: req.flash('success'),
            select: select,
            username
        });
    });
 
    router.post('/accounts/views/changepassword/:username', restrict, isAdmin, async function(req, res){
        const username = req.params.username;
        const list = await accountModel.singleUser_Resetpassword(username);
        if (list.length === 0){
            return res.redirect('/admin/accounts?select=subscriber');
        }
        const account = list[0];

        if (!req.body.PasswordOld || !req.body.Password || !req.body.Confirm){
            req.flash('error', 'Mục bắt buộc không được để trống.');
            return res.redirect(`/admin/accounts/views/changepassword/${username}`);
        }

        const rs = bcrypt.compareSync(req.body.PasswordOld, account.Password_hash);
        if (rs === false){
            req.flash('error', 'Mật khẩu cũ không đúng.');
            return res.redirect(`/admin/accounts/views/changepassword/${username}`);
        }

        if (req.body.Password !== req.body.Confirm){
            req.flash('error', 'Mật khẩu mới không trùng khớp.');
            return res.redirect(`/admin/accounts/views/changepassword/${username}`);
        }

        const pw_hash = bcrypt.hashSync(req.body.Password, config.authentication.saltRounds);
    
        const entity = {
            Id: account.Id,
            Password_hash: pw_hash
        }

        await accountModel.patch(entity);
                
        req.flash('success', 'Thay đổi mật khẩu thành công.');
        return res.redirect(`/admin/accounts/views/changepassword/${username}`);
    });
    router.post('/accounts/views/resetpassword', restrict, isAdmin, async function(req, res){
        const username = req.body.Username;
        const list = await accountModel.singleUser_Resetpassword(username);
        console.log(list);
        if (list.length === 0){
            return res.redirect('/admin/accounts?select=subscriber');
        }

        const account = list[0];
        var select = 'subscriber';
        if (account.TypeAccount === 2){
            select = 'writer';
        }
        else if (account.TypeAccount === 3){
            select = 'editor';
        }
                
        const pw_hash = bcrypt.hashSync('123456', config.authentication.saltRounds);
    
        const entity = {
            Id: account.Id,
            Password_hash: pw_hash
        }

        await accountModel.patch(entity);
                
        req.flash('success', 'Thay đổi mật khẩu thành công.');
        return res.redirect(`/admin/accounts/views/changepassword/${username}`);
    });

    // lock account (update IsDelete = 1)
    router.post('/accounts/lock', restrict, isAdmin, async function(req, res){
        try{
            const id = req.body.Id;
            await accountModel.Provision(id);
            const type = +req.body.TypeAccount || 1;
            var str = 'subscriber';
            if (type === 2) str = 'writer';
            else if (type === 3) str = 'editor'; 
            return res.redirect(`/admin/accounts?select=${str}`);
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/accounts/errDel');
        }
    })
    // open account (update IsDelete = 0)
    router.post('/accounts/open', restrict, isAdmin, async function(req, res){
        try{
            const id = req.body.Id;
            await accountModel.activate(id);
            const type = +req.body.TypeAccount || 1;
            var str = 'subscriber';
            if (type === 2) str = 'writer';
            else if (type === 3) str = 'editor'; 
            return res.redirect(`/admin/accounts?select=${str}`);
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/accounts/errDel');
        }
    })

    router.get('/accounts/managecategory/:username', restrict, isAdmin, async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'accounts') {
              c.isActive = true;
            }
        }
        const username = req.params.username;

        const page = +req.query.page || 1;
        if (page < 0) page = 1;
        const offset = (page - 1) * config.pagination.limit;

        const [list, total] = await Promise.all([
            accountModel.singleId_editAccount_lo(username, config.pagination.limit, offset),
            accountModel.countSingleId_editAccount()
        ]);

        if (list.length === 0){
            return res.redirect('/admin/accounts?select=editor');
        }
            
        const id = list[0].Id;

        const mc = await categoryModel.allMain_EditorManage(id);

        const [page_items, entity] = pagination_js.pageLinks(page, total[0].SoLuong);

        return res.render('vwAdmin/vwAccount/mcAccount', {
            layout: 'homeadmin',
            err: req.flash('error'),
            success: req.flash('success'),
            empty: mc.length === 0,
            categories: mc,
            page_items,
            entity,
            username
        })
    })
    router.post('/accounts/managecategory', restrict, isAdmin, async function(req, res){
        const username = req.body.Username;
   
        const id = req.body.Id;
        const rows = await editoraccountModel.singleId(id);
        if (rows.length !== 0){
            await editoraccountModel.del_notsafe(rows[0].Id);
        }
        
        return res.redirect(`/admin/accounts/managecategory/${username}`);
    })
    router.get('/accounts/managecategory/manage/:username', restrict, isAdmin, async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'accounts') {
              c.isActive = true;
            }
        }
        const username = req.params.username;
        const list = await accountModel.singleId_MCAccount(username);
        if (list.length === 0){
            return res.redirect('/admin/accounts?select=editor');
        }
            
        const account = list[0];
        account.Username = username;

        const mc = await categoryModel.allMain_EditorManageCategories(account.Id);

        const notmanage = await categoryModel.allMain_NotManage();

        return res.render('vwAdmin/vwAccount/addMCAccount', {
            layout: 'homeadmin',
            err: req.flash('error'),
            success: req.flash('success'),
            empty: mc.length === 0,
            categories: mc,
            account: account,
            notmanage: notmanage
        })
    })
    router.post('/accounts/managecategory/manage', restrict, isAdmin, async function(req, res){
        const id = req.body.Id;
        const array = await categoryModel.allMainId_EditorManageCategories(id);

        if (array.length !== 0){
            const manage = req.body.Manage;
            if (!manage){
                for (d of array){
                    const rows = await editoraccountModel.singleId(d.Id);
                    if (rows.length !== 0){
                        await editoraccountModel.del_notsafe(rows[0].Id);
                    }
                }
            }
            else{
                const sosanh = (a) => {
                    for (m of manage){
                        if (+m === a.Id)
                        return false;
                    }
                    return true;
                }
                const delCat = array.filter(sosanh);
                for (d of delCat){
                    const rows = await editoraccountModel.singleId(d.Id);
                    if (rows.length !== 0){
                        await editoraccountModel.del_notsafe(rows[0].Id);
                    }
                }
            }
        }
        
        const notmanage = req.body.NotManage;
        if (notmanage){
            for (m of notmanage){
                const entity = {
                    IdAccount: id,
                    IdCategories: +m,
                    IsDelete: 0
                }
                await editoraccountModel.add(entity);
            }
        }
        const username = req.body.Username;
        req.flash('success', 'Thay đổi thành công.');
        return res.redirect(`/admin/accounts/managecategory/manage/${username}`);
    })
}