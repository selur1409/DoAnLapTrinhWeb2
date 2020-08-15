const postModel = require('../../Models/post.model');
const moment = require('moment');
const statusModel = require('../../Models/statuspost.model');
const {getTimeBetweenDate} = require('../../js/betweendate');
const db = require('../../Models/Writer');
const {restrict, isAdmin} = require('../../middlewares/auth.mdw');
const {mark_url} = require('../../js/check');
const multer = require('multer');
let upload = multer();
const fs = require('fs');
const path = require('path');
const categoriesModel = require('../../Models/category.model');
const categoryModel = require('../../Models/category.model');
const tagModel = require('../../Models/tag.model');
const editorModel = require('../../Models/editor.model');
const commentModel = require('../../Models/comment.model');
const { resolveSoa } = require('dns');
const {pagination} = require('../../config/default.json');
const pagination_js = require('../../js/pagination');
const config = require('../../config/default.json');

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

    function getFullSrcImg(value) {
        let result;
        let res = [];
        const regex = RegExp(`<img.*?src="([^">]*\/([^">]*?))".*?>`, 'g');
        while ((result = regex.exec(value))) {
            res.push(result[1]);
        }
        return res;
    }

    function RemoveImage(directoryPath, tagsImg) {
        fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
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
    router.post('/Upload_IMG', restrict, isAdmin, async (req, res) => {
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
    router.get('/posts/add', restrict, isAdmin, async (req, res) => {
        try {
            for (const c of res.locals.lcManage) {
                if (c.link === 'posts') {
                  c.isActive = true;
                }
            }
            const [Tags, Categories, Categories_sub] = await Promise.all([db.LoadTag(), db.LoadCategories(), db.LoadSubCategories()]);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
            res.render('vwAdmin/vwPosts/addPost', {
                layout: 'homeadmin',
                ListTag: Tags,
                ListCat: Categories,
                ListSubCat: Categories_sub,
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

    router.post('/posts/add', restrict, isAdmin, upload.fields([]), async (req, res, next) => {
        try {
            let checkbox = JSON.parse(req.body.arrCheck);
            const IsDelete = 0;
            const IdStatus = 4;
            const IdPost =  -1;
            const DatePost = moment().format('YYYY-MM-DD HH:mm:ss');
            const DateTimePost = '0000-00-00 00:00:00';
            const View = 0;
            const Avatar = null;
            const IdCategories = req.body.Categories;
            const Title = req.body.Title;
            const Url = mark_url(Title) + "-" + Date.now();
            const FullContent = req.body.FullCont;
            const BriefContent = req.body.BriefCont;
            const IdAccount = res.locals.lcAuthUser.Id;
           

            //get tagImg in full content
            const tagsImg = getTagImg(FullContent);
            const fullSrcImg = getFullSrcImg(FullContent);
            const directoryPath = path.join(__dirname, '../../public/img/ImagePost/temp');

            if (checkbox.length === 0 || IdCategories === '' || FullContent === '' || BriefContent === '' || Title === '') {
                res.json({ fail: 'Please complete all fields in the form' });
            }
            else {

                const Check = await db.CheckTitleIsExistsInPost(Title, Url, IdPost);

                if (Check.length !== 0) {
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
                    const regexTest =  RegExp(`(<img.*?src=")(.*temp*)(\/[^">]*?")(.*?>)`, 'g');
                    const regexAvatar = RegExp(`(.*temp*)`);
                    const regex = RegExp(`(<img.*?src=")([^">]*)(\/[^">]*?")(.*?>)`, 'g');
                    let NewFullContent;
                    let NewAvatar;

                    if (FullContent.match(regexTest)) {
                        NewFullContent = FullContent.replace(regexTest, `$1${NewTagImg}$3$4`);
                        if (fullSrcImg[0].match(regexAvatar)) {
                            NewAvatar = fullSrcImg.length > 0 ? '/../public/img/ImagePost/' + Result.insertId + '/' + tagsImg[0] : null;
                        }
                        else {
                            NewAvatar = fullSrcImg.length > 0 ? fullSrcImg[0] : null;
                        }
                    }
                    else {
                        NewFullContent = FullContent;
                        NewAvatar = fullSrcImg.length > 0 ? fullSrcImg[0] : null;
                    }


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

                    res.json({ success: 'This article has been sent successfully!' });
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    });

    //Using to save img from update-post page into folder at server
    router.post('/UpdateIMG', restrict, isAdmin, async (req, res)=>{
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
    router.get('/posts/update', restrict, isAdmin, async (req, res)=>{
        for (const c of res.locals.lcManage) {
            if (c.link === 'posts') {
              c.isActive = true;
            }
        }
        const IdPost = +req.query.id;
        const Post = await db.LoadSinglePost(IdPost);
        const TagOfPost = await db.LoadTagOfPost(IdPost);

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
                Tag:TagOfPost,
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
                },
                IsSelected:function(value, options)
                {
                    let ret="";
                    if(Post[0].IdCategories === value)
                    {
                        ret = ret + options.fn();
                    }
                    return ret;
                },
                TagSelected:function(context, Id, options){
                    let ret="";
                    for(let i = 0; i < context.length; i++)
                    {
                        if(context[i].IdTag === Id)
                        {
                            ret = ret + options.fn();
                        }
                    }
                    return ret;
                }
                }
            });
        }   
    });
    
    router.post('/posts/update', restrict, isAdmin, upload.fields([]), async (req,res, next)=>{
        try{
            let checkbox = JSON.parse(req.body.arrCheck);
            const IdPost = +req.query.id;
            const IsDelete = 0;
            const IdStatus = 4;
            const DatePost = moment().format('YYYY-MM-DD HH:mm:ss');
            const DateTimePost = '0000-00-00 00:00:00';
            const View = 0;
            let Avatar = null;
            const IdCategories = req.body.Categories;
            const Title = req.body.Title;
            const Url = mark_url(Title) + "-" + Date.now();
            const FullContent = req.body.FullCont;
            const BriefContent = req.body.BriefCont;
            const IdAccount = res.locals.lcAuthUser.Id;
        
            if(checkbox.length === 0 || IdCategories === '' || FullContent === '' || BriefContent === '' || Title === '')
            {
                res.json({fail:' Please complete all fields in the form'});
            }
            else{
    
                const Check = await db.CheckTitleIsExistsInUpdate(Title, Url, IdPost);
                if(Check.length === 0)
                {
                    res.json({fail:'The title of article is already exists'});
                }
                else
                {

                    let TagsImg = getTagImg(FullContent);
                    let FullSrcImg = getFullSrcImg(FullContent)
                    const regexAvatar = RegExp(`(.*temp*)`);
                    if (FullSrcImg[0].match(regexAvatar)) {
                        Avatar = FullSrcImg.length > 0 ? '/../public/img/ImagePost/' + IdPost + '/' + TagsImg[0] : null;
                    }
                    else {
                        Avatar = FullSrcImg.length > 0 ? FullSrcImg[0] : null;
                    }

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
            console.log(e);
        }
    }); 
    

    router.get('/posts', restrict, isAdmin, async function(req, res){
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
        
        const page = +req.query.page || 1;
        if (page < 0) page = 1;
        const offset = (page - 1) * config.pagination.limit;
       
        var list= [];
        var total = [];

        if (status !== 0){
            [list, total] = await Promise.all([
                postModel.dislayList_Status(status, config.pagination.limit, offset),
                postModel.countDislayList_Status(status)
            ]);
        }
        else{
            [list, total] = await Promise.all([
                postModel.dislayList_lo(config.pagination.limit, offset),
                postModel.countDislayList()
            ]);
            for(l of list){
                delete l.Content_Full;
            }
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
            else if (list[i].IdStatus === 2){
                const amount = await commentModel.countCommentByIdPost_admin_NotCheck(list[i].Id);
                list[i].IsComment = true;
                list[i].AmountComment = amount[0].Count;
                
                list[i].IsPremium = false;
                try{
                    const premium = await postModel.singlePremium_idPost(list[i].Id);
                    if (premium.length === 0){
                        ;
                    }
                    else if (premium[0].IsPremium === 1){
                        list[i].IsPremium = true;
                    }
                }
                catch{
                    req.flash('error', 'Premium không tồn tại.');
                    return res.redirect('/admin/posts');
                }
            }
            else if (list[i].IdStatus === 1){
                list[i].IsPremium = false;
                try{
                    const premium = await postModel.singlePremium_idPost(list[i].Id);
                    if (premium.length === 0){
                        ;
                    }
                    else if (premium[0].IsPremium === 1){
                        list[i].IsPremium = true;
                    }
                }
                catch{
                    req.flash('error', 'Premium không tồn tại.');
                    return res.redirect('/admin/posts');
                }

                list[i].Publish = true;
            }
        }

        const [page_items, entity] = pagination_js.pageLinks(page, total[0].SoLuong);
        for (p of page_items){
            p.select = status;
        }

        return res.render('vwAdmin/vwPosts/listPost', {
            layout: 'homeadmin',
            posts: list,
            empty: list.length === 0,
            status: listStatus,
            page_items,
            entity,
            select: status,
            err: req.flash('error'),
            success: req.flash('success')
        });
    });
    
    router.get('/posts/status', restrict, isAdmin, async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'posts') {
              c.isActive = true;
            }
        }
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
        {    
            isDenied = true;
            const loadFb = await postModel.LoadFeedBackOfPosts(posts[0].Id);
            if (loadFb.length === 0){
                req.flash('error', 'Bài viết bị từ chối nhưng không có phản hồi.');
                return res.redirect('/admin/posts?status=3');
            }
            loadFb[0].DatetimeApproval = moment(loadFb[0].DatetimeApproval, 'YYYY/MM/DD HH:mm:ss').format('HH:mm:ss DD/MM/YYYY');
            posts[0].Feedback = loadFb[0];
        }
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

    router.post('/posts/status/deny', restrict, isAdmin, async function (req, res){
        const idPost = req.body.Id;
        const Note = req.body.Note;
        if(!Note)
        {
            req.flash('error', 'Cần ghi chú rõ lý do để phóng viên có thể hiệu chỉnh lại bài viết cho phù hợp.');
            return res.redirect(`/admin/posts/status?number=${req.body.number}&url=${req.body.Url}`);
        }

        const entity = {
            Id: idPost,
            IdStatus: 3
        }
        await postModel.patch(entity);
        
        const IdEditorAccount = res.locals.lcAuthUser.Id;
        const DatetimeApproval = moment().format('YYYY-MM-DD HH:mm:ss');
        
        const ValueOfFeedback = ['Note', 'DatetimeApproval', 'IdEditorAccount', 'IdPost', 'IsDelete', `${Note}`, `${DatetimeApproval}`, `${IdEditorAccount}`, `${idPost}`, 0];
        await editorModel.InsertFeedbackPost(ValueOfFeedback);
        
        return res.redirect('/admin/posts?status=3');
    })
    router.post('/posts/status/accept', restrict, isAdmin, async function (req, res){
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
        await editorModel.DeleteTagsOfPost(id);
        
        for (l of listTag){
            const entityTag = {
                IdTag: +l,
                IdPost: id
            }
            const value = ['IdTag', 'IdPost', `${entityTag.IdTag}`, `${entityTag.IdPost}`];
            await editorModel.InsertTagsPost(value);
        }

        const entity = {
            Id: id,
            IdStatus: 1,
            IdCategories: req.body.selectCatSub,
            DatetimePost: dt_exp
        }
        await postModel.patch(entity);

        const IsPremium = +req.body.Premium || 0;
        const entityPostDetails = {
            Id: id,
            IsPremium: IsPremium
        }
        await editorModel.UpdateIsPremium(entityPostDetails);
        return res.redirect('/admin/posts?status=1');
    })

    router.post('/posts/status/repost', restrict, isAdmin, async function (req, res){
        const listTag = req.body.TagSeleted || [];

        if (listTag.length === 0){
            req.flash('error', 'Phải lựa chọn ít nhất 1 thẻ Tag.');
            return res.redirect(`/admin/posts/status?number=${req.body.number}&url=${req.body.Url}`);
        }
        
        const id = req.body.Id;
        await editorModel.DeleteTagsOfPost(id);

        for (l of listTag){
            const entityTag = {
                IdTag: +l,
                IdPost: id,
            }
            const value = ['IdTag', 'IdPost', `${entityTag.IdTag}`, `${entityTag.IdPost}`];
            await editorModel.InsertTagsPost(value);
        }
        
        const entity = {
            Id: id,
            IdStatus: 4,
            IdCategories: req.body.selectCatSub
        }
        await postModel.patch(entity);

        await postModel.provisionFeedback(id);

        return res.redirect('/admin/posts?status=4');
    })

    router.get('/posts/comment', restrict, isAdmin, async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'posts') {
              c.isActive = true;
            }
        }
        const url = req.query.url || "empty";
        const posts = await postModel.single_url_posts(url);
        if (posts.length === 0){
            req.flash('error', 'Bài viết không tồn tại.');
            return res.redirect('/admin/posts');
        }
        if (posts[0].IdStatus !== 2){
            req.flash('error', 'Bài viết chưa được xuất bản.');
            return res.redirect('/admin/posts');
        }

        const offset = (+req.body.number || 0) * pagination.limit;
        
        const post = posts[0];
        const listComment = await commentModel.commentByIdPost_admin(post.Id, offset, pagination.limit);

        for (l of listComment){
            l.DatetimeComment = moment(l.DatetimeComment, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss DD-MM-YYYY');
            l.Url = url;
        }
        const empty = await commentModel.countCommentByIdPost_admin(post.Id);

        // load lên và cập nhật đã xem
        for (l of listComment){
            const entity = {
                Id: l.Id,
                IsCheck: 1
            }
            await commentModel.patch(entity);
        }

        return res.render('vwAdmin/vwPosts/commentPost', {
            layout: 'homeadmin',
            post: post,
            listComment: listComment,
            empty: empty[0].Count,
            more: empty[0].Count > pagination.limit,
            err: req.flash('error'),
            success: req.flash('success')
        })
    })

    router.post('/posts/comment/load', restrict, isAdmin, async function (req, res){
        const url = req.body.url || "empty";
        const posts = await postModel.single_url_posts(url);
        if (posts.length === 0){
            req.flash('error', 'Bài viết không tồn tại.');
            return res.redirect('/admin/posts');
        }
        if (posts[0].IdStatus !== 2){
            req.flash('error', 'Bài viết chưa được xuất bản.');
            return res.redirect('/admin/posts');
        }

        const offset = (+req.body.number || 1) * pagination.limit;

        const post = posts[0];
        const listComment = await commentModel.commentByIdPost_admin(post.Id, offset, pagination.limit);

        for (l of listComment){
            l.DatetimeComment = moment(l.DatetimeComment, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss DD-MM-YYYY');
            l.Url = url;
        }
        
        const empty = await commentModel.countCommentByIdPost_admin(post.Id);
        var more = true;
        if (offset + pagination.limit >= empty[0].Count){
            more = false;
        }
        
        const number = +req.body.number + 1;

        const data = {
            listComment: listComment,
            number: number,
            more: more
        }

        // load lên và cập nhật đã xem
        for (l of listComment){
            const entity = {
                Id: l.Id,
                IsCheck: 1
            }
            await commentModel.patch(entity);
        }
        return res.json(data);
    })

    router.post('/posts/comment/add', restrict, isAdmin, async function(req, res){
        const IdPost = req.body.IdPost;
        const Content = req.body.Content;
        const Img = req.body.Img;
        const Url = req.body.Url;
        if (!Content){
            req.flash('error', 'Nội dung bình luận không thể để trống ');
            return res.redirect(`/admin/posts/comment?url=${Url}`);
        }

        const DatetimeComment = moment().format('YYYY-MM-DD HH:mm:ss');

        const entity = {
            IdPost,
            Content,
            DatetimeComment,
            IsDelete: 0,
            IdAccount: res.locals.lcAuthUser.Id
        }
        await commentModel.add(entity);

        return res.redirect(`/admin/posts/comment?url=${Url}`);
    })

    
    router.get('/posts/details', restrict, isAdmin, async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'posts') {
              c.isActive = true;
            }
        }
        const status = +req.query.number || 0;
        const url = req.query.url || "empty";

        const posts = await postModel.single_url_posts(url);
        if (posts.length === 0){
            req.flash('error', 'Bài viết không tồn tại.');
            return res.redirect('/admin/posts');
        }
        const select = posts[0].IdStatus;

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
                    posts[0].NameCategories = cs.Name;
                }
            }
        }

        const details = await postModel.detailsTags_idPost(posts[0].Id);

        posts[0].DatePost = moment(posts[0].DatePost, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY ');
        posts[0].DatetimePost = moment(posts[0].DatetimePost, 'YYYY/MM/DD HH:mm:ss').format('HH:mm DD/MM/YYYY');
        
        return res.render('vwAdmin/vwPosts/detailPost', {
            layout: 'homeadmin',
            status: status,
            post: posts[0],
            listStatus: listStatus,
            listTags: details
        })
    })

    router.post('/posts/comment/notdislayed', restrict, isAdmin, async function(req, res){
        const id = req.body.Id;
        const url = req.body.Url;
        
        await commentModel.provision(id);
        return res.redirect(`/admin/posts/comment?url=${url}`)
    })

    router.post('/posts/del', restrict, isAdmin, async function(req, res){
        const id = +req.body.Id;
        const status = req.body.Status;

        await postModel.provisionPost(id);
        return res.redirect(`/admin/posts?stauts=${status}`);
    })


    router.get('/posts/activate', restrict, isAdmin, async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'posts') {
              c.isActive = true;
            }
        }

        const page = +req.query.page || 1;
        if (page < 0) page = 1;
        const offset = (page - 1) * config.pagination.limit;

        const [list, total] = await Promise.all([
            postModel.dislayList_activate(config.pagination.limit, offset),
            postModel.countDislayList_activate()
        ]);

        for (i = 0; i < list.length; i++){
            if (list[i].IdStatus === 4)
            {
                list[i].DatetimePost = 'Chưa có';
            }
            else{
                list[i].DatetimePost = moment(list[i].DatetimePost, 'YYYY/MM/DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
            }
            
            if (list[i].IdStatus === 2 || list[i].IdStatus === 1){
                list[i].IsPremium = false;
                try{
                    const premium = await postModel.singlePremium_idPost(list[i].Id);
                    if (premium.length === 0){
                        ;
                    }
                    else if (premium[0].IsPremium === 1){
                        list[i].IsPremium = true;
                    }
                }
                catch{
                    req.flash('error', 'Premium không tồn tại.');
                    return res.redirect('/admin/posts');
                }
            }
        }
        const [page_items, entity] = pagination_js.pageLinks(page, total[0].SoLuong);
        

        return res.render('vwAdmin/vwPosts/activatePost', {
            layout: 'homeadmin',
            posts: list,
            empty: list.length === 0,
            page_items,
            entity,
            err: req.flash('error'),
            success: req.flash('success')
        });
    })

    router.post('/posts/activate', restrict, isAdmin, async function(req, res){
        const id = req.body.Id;
        const checkId = await postModel.checkId(id);
        if (checkId.length === 0){
            req.flash('error', 'Bài viết đã xóa tạm không tồn tại.');
            return res.redirect('/admin/posts/activate');
        }
        const checkUrl = await postModel.checkPost(checkId[0].Url);
        if (checkUrl.length !== 0){
            req.flash('error', 'Bài viết không thể kích hoạt.');
            return res.redirect('/admin/posts/activate');
        }
        await postModel.activatePost(id);
        return res.redirect('/admin/posts/activate');
    })

    router.post('/posts/publish', restrict, isAdmin, async function(req, res){
        const id = req.body.Id;
        const entity = {
            Id: id,
            IdStatus: 2
        }
        await postModel.patch(entity);
        return res.redirect('/admin/posts?status=1');
    })
}