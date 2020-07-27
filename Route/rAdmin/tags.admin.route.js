const tagModel = require('../../models/tag.model');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const multer = require('multer');
const path = require('path');
const check = require('../../js/check');
const {filesize} = require('../../config/default.json');
module.exports = (router) =>{
    router.get('/tags', async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'tags') {
              c.isActive = true;
            }
        }
    
        const list = await tagModel.all();
        for (l of list){
            // l.href = check.change_characters(l.TagName);
            l.href = l.TagName;
            l.TagName = '#'.concat(l.TagName);
        }
        return res.render('vwAdmin/vwTags/listTag', {
            layout: 'homeadmin',
            empty: list.length === 0,
            tags: list
        });
    });

    router.get('/tags/add', async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'tags') {
              c.isActive = true;
            }
        }

        return res.render('vwAdmin/vwTags/addTag', {
            layout: 'homeadmin',
            err: req.flash('error'),
            success: req.flash('success')
        });
    });

    const storage = multer.diskStorage({
        filename: function(req, file, cb){
            // var name = req.body.Name;
            // if (!name){
            //     name = path.basename(req.originalname);
            // }
            cb(null, check.mark_url(req.body.Name) + '-' + Date.now() + path.extname(file.originalname));
        },
        destination: function(req, file, cb){
            var path = './public/img/tag';
            // kiểm tra xem đã tạo thư mục chưa, nếu ch thì tạo
            fs.mkdir(path,function(e){
                if(!e || (e && e.code === 'EEXIST')){
                    //do something with contents
                    // console.log(e);
                } else {
                    //debug
                    // console.log(e);
                }
            });

            cb(null, path);
        }
    })
    const upload = multer({storage});

    router.post('/tags/add', upload.single('ImgURL'), async function(req, res){
        try{
            const name = req.body.Name;
            const tagName = check.mark_tag(req.body.TagName);

            if(!req.file || !name || !tagName){
                if (req.file){
                    fs.unlinkSync(req.file.path);
                }
                req.flash('error', 'Mục bắt buộc không được để trống hoặc nhập sai định dạng.');
                return res.redirect('/admin/tags/add');
            }
            
            if (req.file.size/filesize > 2)
            {
                fs.unlinkSync(req.file.path);
                req.flash('error', `Ảnh đại diện tag phải nhỏ hơn hoặc bằng 2MB`);
                return res.redirect('/admin/tags/add');
            }

            const file = req.file.filename;
    
            const [isName, isTagName] = await Promise.all([
                tagModel.singleName(name),
                tagModel.singleTagName(tagName)
            ]);
    
            if (isName.length !== 0 || isTagName.length !== 0){
                if (req.file){
                    fs.unlinkSync(req.file.path);
                }
                req.flash('error', 'Tag hoặc TagName đã tồn tại.');
                return res.redirect('/admin/tags/add');
            }
    
            const entity = {
                Name: name,
                TagName: tagName,
                ImgURL: file,
                IsDelete: 0
            }
    
            await tagModel.add(entity);
            req.flash('success', 'Thêm Tag thành công.');
            return res.redirect('/admin/tags/add');
        }
        catch(error){
            console.log(error);
            if (req.file){
                fs.unlinkSync(req.file.path);
            }
        }
    });


    router.get('/tags/edit', async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'tags') {
              c.isActive = true;
            }
        }
        const hashtag = req.query.hashtag;
        if (!hashtag)
        {
            return res.redirect('/admin/tags');
        }

        const isTagName = await tagModel.singleTagName(hashtag);
        if (isTagName.length === 0){
            return res.redirect('/admin/tags');
        }
        isTagName[0].href = isTagName[0].TagName;
        isTagName[0].TagName = '#'.concat(isTagName[0].TagName);

        console.log(isTagName[0]);

        return res.render('vwAdmin/vwTags/editTag', {
            layout: 'homeadmin',
            tag: isTagName[0],
            err: req.flash('error'),
            success: req.flash('success')
        });
    });

    router.post('/tags/edit', upload.single('ImgURL'), async function(req, res){
        try{
            const hashtag = req.query.hashtag || "";
            const hashtaghref = check.change_characters(hashtag);
            
            const isTagNameHash = await tagModel.singleTagName(hashtag);
            if (isTagNameHash.length === 0){
                if (req.file){
                    fs.unlinkSync(req.file.path);
                }
                console.log(1);
                return res.redirect(`/admin/tags`);
            }
            const name = req.body.Name;
            const tempTagName = req.body.TagName;
            
            if(!name || !tempTagName || tempTagName === '#'){
                if (req.file){
                    fs.unlinkSync(req.file.path);
                }                console.log(2);
                req.flash('error', 'Mục bắt buộc không được để trống hoặc nhập sai định dạng.');
                return res.redirect(`/admin/tags/edit?hashtag=${hashtaghref}`);
            }
            
            
            const id = isTagNameHash[0].Id;
            const imgURL = isTagNameHash[0].ImgURL;
            const tagName = check.mark_tag(tempTagName);
    
            const [isName, isTagName] = await Promise.all([
                tagModel.singleNameDuplicate(name, id),
                tagModel.singleTagNameDuplicate(tagName, id)
            ]);
    
            if (isName.length !== 0 || isTagName.length !== 0){
                if (req.file){
                    fs.unlinkSync(req.file.path);
                }                console.log(3);
                req.flash('error', 'Tag hoặc TagName đã tồn tại.');
                return res.redirect(`/admin/tags/edit?hashtag=${hashtaghref}`);
            }

            if (!req.file){
                const entityEmpty = {
                    Id: id,
                    Name: name,
                    TagName: tagName,
                    IsDelete: 0
                }
                await tagModel.patch(entityEmpty);               
                req.flash('success', 'Chỉnh sửa Tag thành công.');
                return res.redirect(`/admin/tags/edit?hashtag=${hashtaghref}`);
            }

            if (req.file.size/filesize > 2)
            {
                fs.unlinkSync(req.file.path);
                req.flash('error', `Ảnh đại diện tag phải dưới 2MB`);                
                return res.redirect(`/admin/tags/edit?hashtag=${hashtaghref}`);               
            }

            const file = req.file.filename;

            const entity = {
                Id: id,
                Name: name,
                TagName: tagName,
                ImgURL: file,
                IsDelete: 0
            }

            fs.unlinkSync(`public/img/tag/${imgURL}`);

            await tagModel.patch(entity);
            req.flash('success', 'Chỉnh sửa Tag thành công.');
            return res.redirect(`/admin/tags/edit?hashtag=${hashtaghref}`);
        }
        catch(error){
            console.log(error);
            if (req.file){
                fs.unlinkSync(req.file.path);
            }
        }
    });

    router.get('/tags/activate', async function(req, res){
        try{
            for (const c of res.locals.lcManage) {
                if (c.link === 'tags') {
                  c.isActive = true;
                }
            }
        
            const list = await tagModel.allActivate();
            return res.render('vwAdmin/vwTags/activateTag', {
                layout: 'homeadmin',
                empty: list.length === 0,
                tags: list,
                err: req.flash('error'),
                success: req.flash('success')
            });
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/tags/err-load-activate');
        }
            
    });
    
    router.post('/tags/activate', async function(req, res){
        try{
            const id = req.body.Id;
        
            const list = await tagModel.singleActivate(id);
            
            if (list.length === 0){
                req.flash('error', 'Không có tags để kích hoạt')
                return res.redirect('/admin/tags/activate');
            }
            const tag = list[0];
            
            const [isName, isTagName] = await Promise.all([
                tagModel.singleNameDuplicate(tag.Name, tag.Id),
                tagModel.singleTagNameDuplicate(tag.TagName, tag.Id)
            ]);
           
            if (isName.length !== 0 || isTagName.length !== 0)
            {  
                req.flash('error', 'Tag hoặc TagName bị trùng.')
                return res.redirect('/admin/categories/activatelv1');
            }
            
            await tagModel.activate(id);
            
            return res.redirect('/admin/tags/activate');
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/tags/error-send-activate'); 
        }
    });

    // xóa tags (update IsDelete = 1)
    router.post('/tags/del', async function(req, res){
        try{
            const id = req.body.Id;
            await tagModel.Provision(id);
            return res.redirect('/admin/tags');
        }
        catch(error){
            console.log(error);
            return res.redirect('/admin/tags/errDel');
        }
    })
}