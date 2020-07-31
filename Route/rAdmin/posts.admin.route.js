const postModel = require('../../models/post.model');
const moment = require('moment');
const statusModel = require('../../models/statuspost.model');
const {getTimeBetweenDate} = require('../../js/betweendate');
const db = require('../../models/Writer');
const {restrict, referer} = require('../../middlewares/auth.mdw');
const {mark_url} = require('../../public/js/ConvertTitleToUrl');
const multer = require('multer');
let upload = multer();
const fs = require('fs');
const path = require('path');
const categoriesModel = require('../../models/category.model');
const categoryModel = require('../../models/category.model');
const tagModel = require('../../models/tag.model');
const flash = require('express-flash');

module.exports = (router) => {

    function getTagImg(value) {
        let result;
        let res = [];
        const regex = RegExp(`<img.*?src="([^">]*\/([^">]*?))".*?>`, 'g');
        while ((result = regex.exec(value))) {
            res.push(result[2]);
        }
        return res;
    }

    function RemoveImage(directoryPath, tagsImg) {
        fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
                console.log(directoryPath);
                console.log(tagsImg);
            }

            //listing all files using forEach
            files.forEach(file => {
                if (tagsImg.includes(file)) {
                    console.log("file exists");
                }
                else {
                    fs.unlinkSync(directoryPath + '\\' + file);
                }
            });
        });
    }

    function UploadIMG(DirName, req, res) {
        const storage = multer.diskStorage({
            filename(req, file, cb) {
                cb(null, file.originalname);
            },
            destination(req, file, cb) {
                cb(null, './public/img/ImagePost/' + DirName);
            }
        })

        upload = multer({
            storage,
            fileFilter: function (req, file, cb) {
                if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
                    req.fileValidationError = 'Only image files are allowed!';
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            }
        });

        upload.array('file', 1)(req, res, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(req.files);
                console.log("Success");
                Path = '/public/img/ImagePost/' + DirName + '/' + req.files[0].filename;
                res.json({ location: Path });
            }
        });
    }

    //Using to save img from editor tinymce to folder at server 
    router.post('/Upload_IMG', restrict, async (req, res) => {
        const folderName =  './public/img/ImagePost/temp';
        try {
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName, { recursive: true }, function (err) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("New directory successfully created.");
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
        }
        UploadIMG('temp', req, res);
    });

    //render editor tinymce to post
    router.get('/posts/add', restrict, async (req, res) => {
        try {

            const [Tags, Categories, Categories_sub] = await Promise.all([db.LoadTag(), db.LoadCategories(), db.LoadSubCategories()]);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
            res.render('vwAdmin/vwPosts/addPost', {
                layout: 'homeadmin',
                ListTag: Tags,
                ListCat: Categories,
                ListSubCat: Categories_sub,
                Name: res.locals.lcAuthUser.Username,
                Avatar: res.locals.lcAuthUser.Avatar,
                helpers: {
                    count_index: function (value) {
                        if (value % 3 === 0 && value !== 0) {
                            return "<div class=w-100>" + "</div>";
                        }
                    },

                    load_sub_cat: function (context, Id, options) {
                        let ret = "";
                        for (let i = 0; i < context.length; i++) {
                            if (context[i].IdCategoriesMain === Id) {
                                ret = ret + options.fn(context[i]);
                            }
                        }
                        return ret;
                    }
                }
            });

        }
        catch (e) {
            console.log(e);
        }
    });

    router.post('/posts/add', restrict, upload.fields([]), async (req, res, next) => {
        try {

            let checkbox = JSON.parse(req.body.arrCheck);
            const IsDelete = 0;
            const IdStatus = 4;
            const DatePost = moment().format('YYYY-MM-DD HH:mm:ss');
            const DateTimePost = null;
            const View = 0;
            const Avatar = null;
            const IdCategories = req.body.Categories;
            const Title = req.body.Title;
            const Url = mark_url(Title);
            const FullContent = req.body.FullCont;
            const BriefContent = req.body.BriefCont;
            const IdAccount = res.locals.lcAuthUser.Id;
           

            //get tagImg in full content
            const tagsImg = getTagImg(FullContent);
            const directoryPath = path.join(__dirname, '../../public/img/ImagePost/temp');

            if (checkbox.length === 0 || IdCategories === '' || FullContent === '' || BriefContent === '' || Title === '') {
                res.json({ fail: 'Please complete all fields in the form' });
            }
            else {
                const Check = await db.CheckTitleIsExists(Title, Url);

                if (Check.length !== 0) {
                    console.log(Check);
                    res.json({ fail: 'The title of article is already exists.' });

                }
                else {

                    let Temp = [];
                    const ValueOfPost = ['Title', 'Content_Summary', 'Content_Full', 'DatePost', 'Avatar', 'Views', 'DatetimePost', 'Url', 'IdCategories', 'IdStatus', 'IsDelete', `${Title}`, `${BriefContent}`, `${FullContent}`, `${DatePost}`, `${Avatar}`, `${View}`, `${DateTimePost}`, `${Url}`, `${IdCategories}`, `${IdStatus}`, `${IsDelete}`]
                    const Result = await db.InsertPost(ValueOfPost);
                    const ValueOfPostDetail = ['IdPost', 'IdAccount', `${Result.insertId}`, `${IdAccount}`];
                    await db.InsertPostDetail(ValueOfPostDetail);

                    for (let i = 0; i < checkbox.length; i++) {
                        let Tag_Post = [];
                        Tag_Post.push(Result.insertId);
                        Tag_Post.push(parseInt(checkbox[i]));
                        Temp.push(Tag_Post);
                    }

                    const ValueOfTagPost = ['IdPost', 'IdTag', Temp];
                    const result = await db.InsertTagPost(ValueOfTagPost);

                    //remove image is not exists in full content 
                    RemoveImage(directoryPath, tagsImg);

                    //Update src for img tag in Full Content 
                    const NewTagImg = '/public/img/ImagePost/' + Result.insertId;
                    const regex = RegExp(`(<img.*?src=")([^">]*)(\/[^">]*?")(.*?>)`, 'g');
                    let NewFullContent = FullContent.replace(regex, `$1${NewTagImg}$3$4`);
                    let NewAvatar = tagsImg.length > 0 ? '/../public/img/ImagePost/' + Result.insertId + '/' + tagsImg[0] : null;

                    await db.UpdateFullContent(NewFullContent, NewAvatar, Result.insertId);

                    // Rename folder containt image of post by post's Id
                    const NewDirName = path.join(__dirname, '../../public/img/ImagePost/' + Result.insertId);
                    if (fs.existsSync(directoryPath)) {
                        fs.rename(directoryPath, NewDirName, err => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        });
                    }

                    if (result !== null) {
                        res.json({ success: 'This article has been sent successfully!' });
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }); 

    //Using to save img from update-post page into folder at server
    router.post('/UpdateIMG', restrict, async (req, res)=>{
        const idPost = +req.query.id;
        const folderName = path.join(__dirname, '../../public/img/ImagePost/' + idPost);
        try {
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName, {recursive: true}, function (err) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("New directory successfully created.");
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
        }
        UploadIMG(idPost, req, res);
    });
    
    //render page update post
    router.get('/update/', restrict, async (req, res)=>{
        const IdPost = +req.query.id;
        const Post = await db.LoadSinglePost(IdPost);

        if(Post[0].IdStatus === 1 || Post[0].IdStatus === 2)
        {
            res.render('vwAdmin/vwPosts/updatePost',{
                layout: 'homeadmin',
                Name:res.locals.lcAuthUser.Username,
                Avatar:res.locals.lcAuthUser.Avatar,
                Url:req.headers.referer,
                NotFound:true
            });
        }
        else
        {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
            const [Tags, Categories, Categories_sub]  = await Promise.all([db.LoadTag(), db.LoadCategories(), db.LoadSubCategories()]);
            res.render('vwAdmin/vwPosts/updatePost',{
                isActive:true,
                layout: 'homeadmin',
                Id:IdPost,
                ListTag:Tags,
                ListCat:Categories,
                ListSubCat:Categories_sub,
                FullCont:Post[0].Content_Full,
                BriefCont:Post[0].Content_Summary,
                Title:Post[0].Title,
                Name:res.locals.lcAuthUser.Username,
                Avatar:res.locals.lcAuthUser.Avatar,
                Url:req.headers.referer,
                helpers: {
                    count_index: function(value){
                    if(value % 3 === 0 && value !== 0)
                    {
                    return "<div class=w-100>" + "</div>";
                    }
                },
                load_sub_cat: function(context, Id, options){
                    let ret="";
                    for(let i = 0; i < context.length; i++)
                    {
                    if(context[i].IdCategoriesMain === Id)
                    {
                        ret = ret + options.fn(context[i]);
                    }
                    }
                    return ret;
                },
                NotUpdate:function(value, options)
                {
                        let ret="";
                        if(4 === value || 2 === value)
                        {
                            ret = ret + options.fn("The article has been approval. You cannot change it");
                        }
                        return ret;
                }
                }
            });
        }   
    });
    
    router.post('/update/', restrict, upload.fields([]), async (req,res, next)=>{
        try{
            let checkbox = JSON.parse(req.body.arrCheck);
            const IdPost = +req.query.id;
            const IsDelete = 0;
            const IdStatus = 4;
            const DatePost = moment().format('YYYY-MM-DD HH:mm:ss');
            const DateTimePost = null;
            const View = 0;
            let Avatar = null;
            const IdCategories = req.body.Categories;
            const Title = req.body.Title;
            const Url = mark_url(Title);
            const FullContent = req.body.FullCont;
            const BriefContent = req.body.BriefCont;
            const IdAccount = res.locals.lcAuthUser.Id;
        
            if(checkbox.length === 0 || IdCategories === '' || FullContent === '' || BriefContent === '' || Title === '')
            {
                res.json({fail:' Please complete all fields in the form'});
            }
            else{
    
                const Check = await db.CheckTitleIsExists(Title, Url, IdPost);
                
                if(Check.length !== 0)
                {
                    res.json({fail:'The title of article is already exists'});
                }
                else
                {
                    let content = FullContent + BriefContent;
                    let TagsImg = getTagImg(content);
                    Avatar = '/../public/img/ImagePost/' + IdPost + '/' + TagsImg[0];
                    const ValueOfPost = [`${Title}`, `${Url}`, `${BriefContent}`, `${FullContent}`, `${DatePost}`, `${Avatar}`, `${View}`, `${DateTimePost}`, `${IdCategories}`, `${IdStatus}`, `${IsDelete}`, `${IdPost}`];
                    const Result = await db.UpdatePostOfWriter(ValueOfPost);
                    await db.DeleteTagPost(IdPost);
                    let tmp = [];
                    for (let i = 0; i < checkbox.length; i++) {
                        let Tag_Post = [];
                        Tag_Post.push(IdPost);
                        Tag_Post.push(checkbox[i]);
                        tmp.push(Tag_Post);
                    }
                    const ValueOfTagPost = ['IdPost', 'IdTag', tmp];
                    const result = await db.InsertTagPost(ValueOfTagPost);
    
                    //remove image is not exists in full content 
                    const directoryPath = path.join(__dirname, '../../public/img/ImagePost/' + IdPost);
                    RemoveImage(directoryPath, TagsImg);
    
                    if (result !== null) {
                        res.json({success:'This article has been sent successfully!'});
                    }
                }
            }
        }
        catch(e)
        {
            console.log(e);m
        }
    }); 
    

    router.get('/posts', async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'posts') {
              c.isActive = true;
            }
        }

        const status = +req.query.status || 0;
        var listStatus = await statusModel.all();
        listStatus.splice(0, 0, {Id: 0, Name: "Tất cả"});

        if (status < 0 || status > listStatus.length)
        {
            return res.redirect('/admin/posts');
        }

        for (l of listStatus){
            if (l.Id === status){
                l.isActive = true;
            }
            const number = await postModel.countStatus(l.Id);
            l.number_of_status = number[0].Number;
        }

        var list= [];

        if (status !== 0){
            list = await postModel.dislayList_Status(status);
        }
        else{
            list = await postModel.dislayList();
        }
        
        for (i = 0; i < list.length; i++){
            if (list[i].IdStatus === 4)
            {
                list[i].DatetimePost = 'Chưa có';
            }
            else{
                list[i].DatetimePost = moment(list[i].DatetimePost, 'YYYY/MM/DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
            }
            list[i].sttSelect = status;
            if (list[i].IdStatus === 3 || list[i].IdStatus === 4){
                list[i].isUpdate = true;
            }
        }
        
        return res.render('vwAdmin/vwPosts/listPost', {
            layout: 'homeadmin',
            posts: list,
            empty: list.length === 0,
            status: listStatus
        });
    });
    
    router.get('/posts/status', async function(req, res){
        const status = +req.query.number || 0;
        if (status < 0 || status > 4)
        {
            return res.redirect('/admin/posts');
        }
        const url = req.query.url;
        const posts = await postModel.single_url_posts(url);
        if (posts.length === 0){
            return res.redirect('/admin/posts');
        }
        const select = posts[0].IdStatus;
        
        if (select !== 3 && select !== 4)
        {
            return res.redirect('/admin/posts');
        }

        var isApproved = false;
        if (select === 4)
            isApproved = true;
        
        var isDenied = false;
        if (select === 3)
            isDenied = true;

        const listStatus = await statusModel.all();

        for (l of listStatus){
            l.number = status;
            l.url = url;
            if (l.Id === select)
                l.selected = true;
        }
        
        const catMain = await categoryModel.allMain_Posts();
        const catSub = await categoriesModel.allSub_Posts();

        for(cm of catMain)
        {
            cm.categoriesSub = [];
            for(cs of catSub){
                if (posts[0].IdCategories === cs.Id)
                {
                    cs.selected = true;
                }
                if (cm.Id === cs.IdCategoriesMain){
                    cm.categoriesSub.push(cs);
                }
            }
        }

        const listTags = await tagModel.all_Posts();
        const idTagPost = await postModel.singleIdTag_idPost(posts[0].Id);
        for (l of listTags){
            for(t of idTagPost){
                if(l.Id === t.IdTag){
                    l.checked = true;
                    break;
                }
            }
        }

        return res.render('vwAdmin/vwPosts/statusPost', {
            layout: 'homeadmin',
            status: status,
            post: posts[0],
            listStatus: listStatus,
            listCategories: catMain,
            listTags: listTags,
            isApproved, isDenied,
            err: req.flash('error'),
            success: req.flash('success')
        })
    })

    router.post('/posts/status/deny', async function (req, res){
        const id = req.body.Id;
        const entity = {
            Id: id,
            IdStatus: 3
        }
        await postModel.patch(entity);
        return res.redirect('/admin/posts?status=3');
    })
    router.post('/posts/status/accept', async function (req, res){
        const listTag = req.body.TagSeleted || [];
        if (listTag.length === 0){
            req.flash('error', 'Phải lựa chọn ít nhất 1 thẻ Tag.');
            return res.redirect(`/admin/posts/status?number=${req.body.number}&url=${req.body.Url}`);
        }

        if (!req.body.TimePost || isNaN(Date.parse(req.body.TimePost)))
        {
            req.flash('error', 'Chưa chọn thời gian đăng bài.');
            return res.redirect(`/admin/posts/status?number=${req.body.number}&url=${req.body.Url}`);
        }

        const dt_exp = new Date(moment(req.body.TimePost, 'YYYY/MM/DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss'));
        const dt_now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
        if (dt_exp < dt_now){
            req.flash('error', 'Thời gian đăng bài không được nhỏ hơn thời gian hiện tại.');
            return res.redirect(`/admin/posts/status?number=${req.body.number}&url=${req.body.Url}`);
        }
        
        const id = req.body.Id;
        const entity = {
            Id: id,
            IdStatus: 1
        }

        const listTagManage = await postModel.singleIdTag_idPost(id);
        if (listTagManage.length !== 0){
            for (i = 0; i < listTagManage.length; i++){
                //del tag
            }
        }
        
        return res.json(listTagManage);

        await postModel.patch(entity);
        return res.redirect('/admin/posts?status=1');
    })
    router.post('/posts/status/repost', function (req, res){
        res.json(req.body);
    })
}