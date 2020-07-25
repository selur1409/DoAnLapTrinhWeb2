const accountModel = require('../../models/account.model');
const typeModel = require('../../models/typeaccount.model');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const config = require('../../config/default.json');
const {getTimeBetweenDate} = require('../../js/betweendate');
const {getTime_Minutes} = require('../../js/betweendate');
const {addMinutes}= require('../../config/default.json');
const flash = require('express-flash');
// const fs = require('fs-extra');
// const mkdirp = require('mkdirp');
// const multer = require('multer');
// const path = require('path');
// const check = require('../../js/check');
// const {filesize} = require('../../config/default.json');
module.exports = (router) =>{
    router.get('/accounts', async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'accounts') {
              c.isActive = true;
            }
        }

        const select = req.query.select || 'subscriber';
        var list= [];
        var IsActiveWriter = false;
        var IsActiveEditor = false;
        var IsActiveGuest = false;
        var IsActiveSubscriber = false;

        if (select === 'subscriber'){
            list = await accountModel.loadFull_select(1);
            IsActiveSubscriber = true;
            for (i = 0; i < list.length; i++){
                if (list[i].DateExpired)
                {
                    const dt_exp = new Date(moment(list[i].DateExpired, 'YYYY/MM/DD HH:mm:ss'));
                    const dt_now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
                    list[i].prenium = getTimeBetweenDate(dt_now, dt_exp);
                }
            }
        }
        else if (select === 'writer'){
            list = await accountModel.loadFull_select(2);
            IsActiveWriter = true;
            for (i =0; i< list.length; i++){
                list[i].preniumForever = true;
            }
        }
        else if (select === 'editor'){
            list = await accountModel.loadFull_select(3);
            IsActiveEditor = true;
            for (i =0; i< list.length; i++){
                list[i].preniumForever = true;
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

        return res.render('vwAdmin/vwAccount/listAccount', {
            layout: 'homeadmin',
            empty: list.length === 0,
            accounts: list,
            IsActiveWriter,
            IsActiveEditor,
            IsActiveGuest,
            IsActiveSubscriber
        });
    });

    router.get('/accounts/add/:select', async function(req, res){
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

    router.post('/accounts/add/:select', async function(req, res){
        const select = req.params.select;
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
        const dt_now = moment().format('YYYY-MM-DD HH:mm:ss');
        // gia hạn ngày
        var dob = '1999/01/01';
        if (moment(req.body.DOB, "DD/MM/YYYY").isValid === true){
            dob =  moment(req.body.DOB, 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
    
        // Nếu ngày hiện tại <= ngày sinh thì thông báo lỗi
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
    router.get('/accounts/prenium-plus/:username', async function(req, res){
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
            account.prenium = getTimeBetweenDate(dt_now, dt_exp);
        }

        const minutes = addMinutes;

        const time = getTime_Minutes(minutes);
        time.value = +minutes || 1;
        
        return res.render('vwAdmin/vwAccount/preniumAccount', {
            layout: 'homeadmin',
            err: req.flash('error'),
            success: req.flash('success'),
            account: account,
            time: time,
            select: 'subscriber'
        });
    })
    
    
    router.post('/accounts/prenium-plus', async function(req, res){
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
            user.prenium = getTimeBetweenDate(dt_now, dt_exp);
        }

        var date_expired = moment().add(req.body.Time, 'm').format('YYYY:MM:DD H:mm:ss');

        if (user.prenium)
        {
            if (!user.prenium.Notvalue)
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

    router.post('/accounts/delete-prenium', async function(req, res){
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

    router.get('/accounts/views/changepassword/:username', async function(req, res){
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
    router.get('/accounts/views/resetpassword/:username', async function(req, res){
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
                
        return res.render('vwAdmin/vwAccount/resetAccount', {
            layout: 'homeadmin',
            err: req.flash('error'),
            success: req.flash('success'),
            select: select,
            username
        });
    });
    router.post('/accounts/views/changepassword/:username', async function(req, res){
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
    router.post('/accounts/views/resetpassword/:username', async function(req, res){
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
                
        return res.render('vwAdmin/vwAccount/resetAccount', {
            layout: 'homeadmin',
            err: req.flash('error'),
            success: req.flash('success'),
            select: select,
            username
        });
    });


    // const storage = multer.diskStorage({
    //     filename: function(req, file, cb){
    //         // var name = req.body.Name;
    //         // if (!name){
    //         //     name = path.basename(req.originalname);
    //         // }
    //         cb(null, check.mark_url(req.body.Name) + '-' + Date.now() + path.extname(file.originalname));
    //     },
    //     destination: function(req, file, cb){
    //         var path = './public/img/tag';
    //         // kiểm tra xem đã tạo thư mục chưa, nếu ch thì tạo
    //         fs.mkdir(path,function(e){
    //             if(!e || (e && e.code === 'EEXIST')){
    //                 //do something with contents
    //                 // console.log(e);
    //             } else {
    //                 //debug
    //                 // console.log(e);
    //             }
    //         });

    //         cb(null, path);
    //     }
    // })
    // const upload = multer({storage});

    // router.post('/tags/add', upload.single('ImgURL'), async function(req, res){
    //     try{
    //         const name = req.body.Name;
    //         const tagName = check.mark_tag(req.body.TagName);

    //         if(!req.file || !name || !tagName){
    //             if (req.file){
    //                 fs.unlinkSync(req.file.path);
    //             }
    //             req.flash('error', 'Mục bắt buộc không được để trống hoặc nhập sai định dạng.');
    //             return res.redirect('/admin/tags/add');
    //         }
            
    //         if (req.file.size/filesize > 2)
    //         {
    //             fs.unlinkSync(req.file.path);
    //             req.flash('error', `Ảnh đại diện tag phải dưới 2MB`);
    //             return res.redirect('/admin/tags/add');
    //         }

    //         const file = req.file.filename;
    
    //         const [isName, isTagName] = await Promise.all([
    //             tagModel.singleName(name),
    //             tagModel.singleTagName(tagName)
    //         ]);
    
    //         if (isName.length !== 0 || isTagName.length !== 0){
    //             if (req.file){
    //                 fs.unlinkSync(req.file.path);
    //             }
    //             req.flash('error', 'Tag hoặc TagName đã tồn tại.');
    //             return res.redirect('/admin/tags/add');
    //         }
    
    //         const entity = {
    //             Name: name,
    //             TagName: tagName,
    //             ImgURL: file,
    //             IsDelete: 0
    //         }
    
    //         await tagModel.add(entity);
    //         req.flash('success', 'Thêm Tag thành công.');
    //         return res.redirect('/admin/tags/add');
    //     }
    //     catch(error){
    //         console.log(error);
    //         if (req.file){
    //             fs.unlinkSync(req.file.path);
    //         }
    //     }
    // });


    // router.get('/tags/edit', async function(req, res){
    //     for (const c of res.locals.lcManage) {
    //         if (c.link === 'tags') {
    //           c.isActive = true;
    //         }
    //     }
    //     const hashtag = req.query.hashtag;
    //     if (!hashtag)
    //     {
    //         return res.redirect('/admin/tags');
    //     }

    //     const isTagName = await tagModel.singleTagName(hashtag);
    //     if (isTagName.length === 0){
    //         return res.redirect('/admin/tags');
    //     }
    //     isTagName[0].href = check.change_characters(isTagName[0].TagName);

    //     return res.render('vwAdmin/vwTags/editTag', {
    //         layout: 'homeadmin',
    //         tag: isTagName[0],
    //         err: req.flash('error'),
    //         success: req.flash('success')
    //     });
    // });

    // router.post('/tags/edit', upload.single('ImgURL'), async function(req, res){
    //     try{
    //         const hashtag = req.query.hashtag || "";
    //         const hashtaghref = check.change_characters(hashtag);
            
    //         const isTagNameHash = await tagModel.singleTagName(hashtag);
    //         if (isTagNameHash.length === 0){
    //             if (req.file){
    //                 fs.unlinkSync(req.file.path);
    //             }
    //             console.log(1);
    //             return res.redirect(`/admin/tags`);
    //         }
    //         const name = req.body.Name;
    //         const tempTagName = req.body.TagName;
            
    //         if(!name || !tempTagName){
    //             if (req.file){
    //                 fs.unlinkSync(req.file.path);
    //             }                console.log(2);
    //             req.flash('error', 'Mục bắt buộc không được để trống hoặc nhập sai định dạng.');
    //             return res.redirect(`/admin/tags/edit?hashtag=${hashtaghref}`);
    //         }
            
            
    //         const id = isTagNameHash[0].Id;
    //         const imgURL = isTagNameHash[0].ImgURL;
    //         const tagName = check.mark_tag(tempTagName);
    
    //         const [isName, isTagName] = await Promise.all([
    //             tagModel.singleNameDuplicate(name, id),
    //             tagModel.singleTagNameDuplicate(tagName, id)
    //         ]);
    
    //         if (isName.length !== 0 || isTagName.length !== 0){
    //             if (req.file){
    //                 fs.unlinkSync(req.file.path);
    //             }                console.log(3);
    //             req.flash('error', 'Tag hoặc TagName đã tồn tại.');
    //             return res.redirect(`/admin/tags/edit?hashtag=${hashtaghref}`);
    //         }

    //         if (!req.file){
    //             const entityEmpty = {
    //                 Id: id,
    //                 Name: name,
    //                 TagName: tagName,
    //                 IsDelete: 0
    //             }
    //             await tagModel.patch(entityEmpty);               
    //             req.flash('success', 'Chỉnh sửa Tag thành công.');
    //             return res.redirect(`/admin/tags/edit?hashtag=${hashtaghref}`);
    //         }

    //         if (req.file.size/filesize > 2)
    //         {
    //             fs.unlinkSync(req.file.path);
    //             req.flash('error', `Ảnh đại diện tag phải dưới 2MB`);                
    //             return res.redirect(`/admin/tags/edit?hashtag=${hashtaghref}`);               
    //         }

    //         const file = req.file.filename;

    //         const entity = {
    //             Id: id,
    //             Name: name,
    //             TagName: tagName,
    //             ImgURL: file,
    //             IsDelete: 0
    //         }

    //         fs.unlinkSync(`public/img/tag/${imgURL}`);

    //         await tagModel.patch(entity);
    //         req.flash('success', 'Chỉnh sửa Tag thành công.');
    //         return res.redirect(`/admin/tags/edit?hashtag=${hashtaghref}`);
    //     }
    //     catch(error){
    //         console.log(error);
    //         if (req.file){
    //             fs.unlinkSync(req.file.path);
    //         }
    //     }
    // });

    // router.get('/tags/activate', async function(req, res){
    //     try{
    //         for (const c of res.locals.lcManage) {
    //             if (c.link === 'tags') {
    //               c.isActive = true;
    //             }
    //         }
        
    //         const list = await tagModel.allActivate();
    //         return res.render('vwAdmin/vwTags/activateTag', {
    //             layout: 'homeadmin',
    //             empty: list.length === 0,
    //             tags: list,
    //             err: req.flash('error'),
    //             success: req.flash('success')
    //         });
    //     }
    //     catch(error){
    //         console.log(error);
    //         return res.redirect('/admin/tags/err-load-activate');
    //     }
            
    // });
    
    // router.post('/tags/activate', async function(req, res){
    //     try{
    //         const id = req.body.Id;
        
    //         const list = await tagModel.singleActivate(id);
    //         console.log(list);
    //         if (list.length === 0){
    //             req.flash('error', 'Không có tags để kích hoạt')
    //             return res.redirect('/admin/tags/activate');
    //         }
    //         const tag = list[0];
    //         console.log(tag);
    //         const [isName, isTagName] = await Promise.all([
    //             tagModel.singleNameDuplicate(tag.Name, tag.Id),
    //             tagModel.singleTagNameDuplicate(tag.TagName, tag.Id)
    //         ]);
           
    //         if (isName.length !== 0 || isTagName.length !== 0)
    //         {  
    //             req.flash('error', 'Tag hoặc TagName bị trùng.')
    //             return res.redirect('/admin/categories/activatelv1');
    //         }
            
    //         await tagModel.activate(id);
            
    //         return res.redirect('/admin/tags/activate');
    //     }
    //     catch(error){
    //         console.log(error);
    //         return res.redirect('/admin/tags/error-send-activate'); 
    //     }
    // });

    // lock account (update IsDelete = 1)
    router.post('/accounts/lock', async function(req, res){
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
    router.post('/accounts/open', async function(req, res){
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
}