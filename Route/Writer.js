const express = require('express');
const router = express.Router();
const db = require('../Models/Writer');
const flash = require('express-flash');
const config = require('../config/default.json');
const bcrypt = require('bcryptjs');
const multer = require('multer');
let upload = multer();
const moment = require('moment'); moment.locale("vi");
const fs = require('fs');
const path = require('path');
const account = require('../models/account.model');
const {restrict, referer} = require('../middlewares/auth.mdw');
const { route } = require('../route/account.route');
const { CountFB } = require('../Models/Writer');
const { query } = require('express');
const {mark_url} = require('../public/js/ConvertTitleToUrl');

function exposeTemplates(req, res, next) {
    // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
    // templates which will be shared with the client-side of the app.
    hbs.getTemplates('./templates', {
        cache      : app.enabled('view cache'),
        precompiled: true
    }).then(function (templates) {
        // RegExp to remove the ".handlebars" extension from the template names.
        const extRegex = new RegExp(hbs.extname + '$');
  
        // Creates an array of templates which are exposed via
        // `res.locals.templates`.
        templates = Object.keys(templates).map(function (name) {
            return {
                        name: name.replace(extRegex, ""),
                template: templates[name]
            };
        });
  
        // Exposes the templates during view rendering.
        if (templates.length) {
            res.locals.templates = templates;
        }
  
        setImmediate(next);
    })
    .catch(next);
}

function Authories(req, res, next)
{
    const TypeAccount = res.locals.lcAuthUser.TypeAccount;
    if(TypeAccount !== 2)
    {
        res.redirect('/error');
    }
    else{
        next();
    }
}

function getTagImg(value)
{
  let result;
  let res = [];
  const regex = RegExp(`<img.*?src="([^">]*\/([^">]*?))".*?>`, 'g');
  while((result = regex.exec(value)))
  {
    res.push(result[2]);
  }
  return res;
}
function getFullSrcImg(value)
{
    let result;
    let res = [];
    const regex = RegExp(`<img.*?src="([^">]*\/([^">]*?))".*?>`, 'g');
    while ((result = regex.exec(value))) {
        res.push(result[1]);
    }
    return res;
}

function RemoveImage(directoryPath, tagsImg)
{
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

function UploadIMG(DirName, req, res)
{
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
            Path = '/../public/img/ImagePost/' + DirName + '/' + req.files[0].filename;
            res.json({ location: Path });
        }
    });
}

router.post('/Upload_IMG', restrict, Authories, async(req, res)=>{
    const folderName = './public/img/ImagePost/temp';
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
    UploadIMG('temp', req, res);
});

router.get('/Writer', restrict, Authories, async (req,res)=>{
    try{

        const [Tags, Categories, Categories_sub] = await Promise.all([db.LoadTag(), db.LoadCategories(), db.LoadSubCategories()]);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
        res.render('vwWriter/post', {
            layout: 'homewriter',
            ListTag: Tags,
            ListCat: Categories,
            ListSubCat: Categories_sub,
            IsActivePost: true,
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
    catch(e)
    {
        console.log(e);
    }
}); 

router.post('/Writer', restrict, Authories, upload.fields([]), async (req,res, next)=>{
    try{
        let checkbox = JSON.parse(req.body.arrCheck);
        const IsDelete = 0;
        const IdStatus = 4;
        const IdPost = -1;
        const DatePost = moment().format('YYYY-MM-DD HH:mm:ss');
        const DateTimePost = '0000-00-00 00:00:00';
        const View = 0;
        const Avatar = null;
        const IdCategories = req.body.Categories;
        const Title = req.body.Title;
        const Url = mark_url(Title) + '-' + Date.now();
        const FullContent = req.body.FullCont;
        const BriefContent = req.body.BriefCont;
        const IdAccount = res.locals.lcAuthUser.Id; 

        //get tagImg in full content
        const tagsImg = getTagImg(FullContent);
        const fullSrcImg = getFullSrcImg(FullContent);
        const directoryPath = path.join(__dirname, '../public/img/ImagePost/temp');
        
        if (checkbox.length === 0 || IdCategories === '' || FullContent === '' || BriefContent === '' || Title === '') {
            res.json({ fail: 'Please complete all fields in the form' });
        }
        else {
            
            const Check = await db.CheckTitleIsExistsInPost(Title, Url);

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
                const NewTagImg = '/../public/img/ImagePost/' + Result.insertId;
                const regexTest =  RegExp(`(<img.*?src=")(.*temp*)(\/[^">]*?")(.*?>)`, 'g');
                const regexAvatar = RegExp(`(.*temp*)`);
                const regex = RegExp(`(<img.*?src=")([^">]*)(\/[^">]*?")(.*?>)`, 'g');
                let NewFullContent;
                let NewAvatar;
                if(FullContent.match(regexTest))
                {
                    NewFullContent = FullContent.replace(regexTest, `$1${NewTagImg}$3$4`);
                    if(fullSrcImg[0].match(regexAvatar))
                    {
                        NewAvatar = tagsImg.length > 0 ? '/../public/img/ImagePost/' + Result.insertId + '/' + tagsImg[0] : null;
                    }
                    else
                    {
                        NewAvatar = fullSrcImg.length > 0 ? fullSrcImg[0] : null;
                    }
                }
                else
                {
                    NewFullContent = FullContent;   
                    NewAvatar = fullSrcImg.length > 0 ? fullSrcImg[0] : null;
                }

                await db.UpdateFullContent(NewFullContent, NewAvatar, Result.insertId);

                // Rename folder containt image of post by post's Id
                const NewDirName = path.join(__dirname, '../public/img/ImagePost/' + Result.insertId);
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
    catch(e)
    {
        console.log(e);
    }
}); 

router.post('/ViewPost/', restrict, Authories, async (req, res)=>{
    try{

        const page = +req.query.page || 1;
        const IdStatus = +req.query.id;
        const Opt = +req.query.opt || 0;
        const ValueSearch = req.body.Search || '';
        const IdAccount = res.locals.lcAuthUser.Id;
      
        const offset = (page - 1) * config.pagination.limit;
        let [Result, Total, NumberOfPost] = [];

        if (Opt === 1) {
            [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriterThisDayOrThisMonthOrThisYear(IdStatus, IdAccount, config.pagination.limit, offset, '%Y-%m-%d'), db.CountPostOfWriterThisDayOrThisMonthOrThisYear(IdStatus, IdAccount, '%Y-%m-%d'), db.CountNumberPost(IdAccount)]);
        }
        else if (Opt === 2) {
            [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriterThisWeek(IdStatus, IdAccount, config.pagination.limit, offset), db.CountPostOfWriterThisWeek(IdStatus, IdAccount), db.CountNumberPost(IdAccount)]);
        }
        else if (Opt === 3) {
            [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriterThisDayOrThisMonthOrThisYear(IdStatus, IdAccount, config.pagination.limit, offset, '%Y-%m-01'), db.CountPostOfWriterThisDayOrThisMonthOrThisYear(IdStatus, IdAccount, '%Y-%m-01'), db.CountNumberPost(IdAccount)]);
        }
        else if (Opt === 4) {
            [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriterThisDayOrThisMonthOrThisYear(IdStatus, IdAccount, config.pagination.limit, offset, '%Y-01-01'), db.CountPostOfWriterThisDayOrThisMonthOrThisYear(IdStatus, IdAccount, '%Y-01-01'), db.CountNumberPost(IdAccount)]);
        }
        else {
            if(req.body.Search === undefined)
            {
                [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriter(IdStatus, IdAccount, config.pagination.limit, offset), db.CountPostOfWriter(IdStatus, IdAccount), db.CountNumberPost(IdAccount)]);
            }
            else
            {
                [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriterBySearch(IdAccount, config.pagination.limit, offset, ValueSearch), db.CountPostSearch(IdAccount, config.pagination.limit, offset, ValueSearch), db.CountNumberPost(IdAccount)]);
            }
        }
        const nPages = Math.ceil(Total[0].Number / config.pagination.limit);
        const page_items = [];
        let count = 0;
        let lengthPagination = 0;
        let temp = page;

        while (true) {
            if (temp - config.pagination.limitPaginationLinks > 0) {
                count++;
                temp = temp - config.pagination.limitPaginationLinks;
            }
            else {
                break;
            }
        }
        if ((count * config.pagination.limitPaginationLinks) + config.pagination.limitPaginationLinks >= nPages) {
            lengthPagination = nPages;
        }
        else {
            lengthPagination = (count * config.pagination.limitPaginationLinks) + config.pagination.limitPaginationLinks;
        }
        for (let i = (count * config.pagination.limitPaginationLinks) + 1; i <= lengthPagination; i++) {
            const item = {
                value: i,
                isActive: i === page,
                IdStatus,
                Opt
            }
            page_items.push(item);
        }

        res.render('vwWriter/PostOfWriter', {
            layout: 'homewriter',
            empty: Result.length === 0,
            IsActive: true,
            Name: res.locals.lcAuthUser.Username,
            Avatar: res.locals.lcAuthUser.Avatar,
            Search: ValueSearch,
            SearchNotEmpty: ValueSearch.length !== 0,
            IdStatus,
            IsActive1: IdStatus === 1,
            IsActive2: IdStatus === 2,
            IsActive3: IdStatus === 3,
            IsActive4: IdStatus === 4,
            ListPosts: Result,
            helpers: {
                format_datetime: function (value) {
                    const date = moment(value).format("DD-MM-YYYY");
                    return date;
                },

                AvatarPost: function (value){
                    if(value !== null)
                    {
                        return '/public/img/Avatar/' + value;
                    }
                    return 'https://img.favpng.com/25/7/23/computer-icons-user-profile-avatar-image-png-favpng-LFqDyLRhe3PBXM0sx2LufsGFU.jpg';
                },

                Update: function (value, id, options) {
                    if (4 === value || 3 === value) {
                        let ret = "";
                        for (let i = 0; i < Result.length; i++) {
                            if (Result[i].Id === id) {
                                ret = ret + options.fn(Result[i]);
                            }
                        }
                        return ret;
                    }
                    return null;
                },

                FeedBack: function (value, id, options) {
                    if (3 === value) {
                        let ret = "";
                        for (let i = 0; i < Result.length; i++) {
                            if (Result[i].Id === id) {
                                ret = ret + options.fn(Result[i]);
                            }
                        }
                        return ret;
                    }
                    return null;
                },

                NumberOfPost: function (Id) {
                    for (let i = 0; i < NumberOfPost.length; i++) {
                        if (NumberOfPost[i].Id === Id) {
                            return NumberOfPost[i].Number;
                        }
                    }
                }

            },

            page_items,
            prev_value: page - 1,
            next_value: page + 1,
            can_go_prev: page > 1,
            can_go_next: page < nPages,
            last: nPages,
            Opt
        });
    }
    catch(e)
    {
        console.log(e);
    }
});

router.get('/ViewPost/', restrict, Authories, async (req, res)=>{
    try{

        const page = +req.query.page || 1;
        const IdStatus = +req.query.id;
        const Opt = +req.query.opt || 0;
        const ValueSearch = req.query.Search || '';
        const IdAccount = res.locals.lcAuthUser.Id;

        const offset = (page - 1) * config.pagination.limit;
        let [Result, Total, NumberOfPost] = [];

        if (Opt === 1) {
            [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriterThisDayOrThisMonthOrThisYear(IdStatus, IdAccount, config.pagination.limit, offset, '%Y-%m-%d'), db.CountPostOfWriterThisDayOrThisMonthOrThisYear(IdStatus, IdAccount, '%Y-%m-%d'), db.CountNumberPost(IdAccount)]);
        }
        else if (Opt === 2) {
            [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriterThisWeek(IdStatus, IdAccount, config.pagination.limit, offset), db.CountPostOfWriterThisWeek(IdStatus, IdAccount), db.CountNumberPost(IdAccount)]);
        }
        else if (Opt === 3) {
            [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriterThisDayOrThisMonthOrThisYear(IdStatus, IdAccount, config.pagination.limit, offset, '%Y-%m-01'), db.CountPostOfWriterThisDayOrThisMonthOrThisYear(IdStatus, IdAccount, '%Y-%m-01'), db.CountNumberPost(IdAccount)]);
        }
        else if (Opt === 4) {
            [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriterThisDayOrThisMonthOrThisYear(IdStatus, IdAccount, config.pagination.limit, offset, '%Y-01-01'), db.CountPostOfWriterThisDayOrThisMonthOrThisYear(IdStatus, IdAccount, '%Y-01-01'), db.CountNumberPost(IdAccount)]);
        }
        else {
            if(req.query.Search === undefined)
            {
                [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriter(IdStatus, IdAccount, config.pagination.limit, offset), db.CountPostOfWriter(IdStatus, IdAccount), db.CountNumberPost(IdAccount)]);
            }
            else
            {
                [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriterBySearch(IdAccount, config.pagination.limit, offset, ValueSearch), db.CountPostSearch(IdAccount, config.pagination.limit, offset, ValueSearch), db.CountNumberPost(IdAccount)]);
            }
        }
        const nPages = Math.ceil(Total[0].Number / config.pagination.limit);
        const page_items = [];
        let count = 0;
        let lengthPagination = 0;
        let temp = page;

        while (true) {
            if (temp - config.pagination.limitPaginationLinks > 0) {
                count++;
                temp = temp - config.pagination.limitPaginationLinks;
            }
            else {
                break;
            }
        }
        if ((count * config.pagination.limitPaginationLinks) + config.pagination.limitPaginationLinks >= nPages) {
            lengthPagination = nPages;
        }
        else {
            lengthPagination = (count * config.pagination.limitPaginationLinks) + config.pagination.limitPaginationLinks;
        }
        for (let i = (count * config.pagination.limitPaginationLinks) + 1; i <= lengthPagination; i++) {
            const item = {
                value: i,
                isActive: i === page,
                IdStatus,
                Opt
            }
            page_items.push(item);
        }

        res.render('vwWriter/PostOfWriter', {
            layout: 'homewriter',
            empty: Result.length === 0,
            IsActive: true,
            Name: res.locals.lcAuthUser.Username,
            Avatar: res.locals.lcAuthUser.Avatar,
            Search: ValueSearch,
            SearchNotEmpty: ValueSearch.length !== 0,
            IdStatus,
            IsActive1: IdStatus === 1,
            IsActive2: IdStatus === 2,
            IsActive3: IdStatus === 3,
            IsActive4: IdStatus === 4,
            ListPosts: Result,
            helpers: {
                format_datetime: function (value) {
                    const date = moment(value).format("DD-MM-YYYY");
                    return date;
                },

                AvatarPost: function (value){
                    if(value !== null)
                    {
                        return '/public/img/Avatar/' + value;
                    }
                    return 'https://img.favpng.com/25/7/23/computer-icons-user-profile-avatar-image-png-favpng-LFqDyLRhe3PBXM0sx2LufsGFU.jpg';
                },

                Update: function (value, id, options) {
                    if (4 === value || 3 === value) {
                        let ret = "";
                        for (let i = 0; i < Result.length; i++) {
                            if (Result[i].Id === id) {
                                ret = ret + options.fn(Result[i]);
                            }
                        }
                        return ret;
                    }
                    return null;
                },

                FeedBack: function (value, id, options) {
                    if (3 === value) {
                        let ret = "";
                        for (let i = 0; i < Result.length; i++) {
                            if (Result[i].Id === id) {
                                ret = ret + options.fn(Result[i]);
                            }
                        }
                        return ret;
                    }
                    return null;
                },

                NumberOfPost: function (Id) {
                    for (let i = 0; i < NumberOfPost.length; i++) {
                        if (NumberOfPost[i].Id === Id) {
                            return NumberOfPost[i].Number;
                        }
                    }
                }

            },

            page_items,
            prev_value: page - 1,
            next_value: page + 1,
            can_go_prev: page > 1,
            can_go_next: page < nPages,
            last: nPages,
            Opt
        });
    }
    catch(e)
    {
        console.log(e);
    }
});

router.get('/DetailPost/', restrict, Authories, async (req, res)=>{
    const IdPost = +req.query.id;
    const Post = await db.LoadSinglePost(IdPost);
    const Status = await db.LoadStatusById(Post[0].IdStatus);
    const Categories = await db.LoadCategoriesById(Post[0].IdCategories);
    res.json({Post, Status, Categories});
});

router.post('/UpdateIMG', restrict, Authories, async (req, res)=>{
    const idPost = +req.query.id;
    const folderName = path.join(__dirname, '../public/img/ImagePost/' + idPost);
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

router.get('/Update/:id', restrict, Authories, async (req, res)=>{
    const IdPost = +req.params.id;
    const Post = await db.LoadSinglePost(IdPost);
    const TagOfPost = await db.LoadTagOfPost(IdPost);
    // const Status = await db.LoadStatusById(Post[0].IdStatus);
    // const Categories = await db.LoadCategoriesById(Post[0].IdCategories);
    if(Post[0].IdStatus === 1 || Post[0].IdStatus === 2)
    {
        res.render('vwWriter/Update',{
            IsActiveUpdate:true,
            layout: 'homewriter',
            Name:res.locals.lcAuthUser.Username,
            Avatar:res.locals.lcAuthUser.Avatar,
            Url:req.headers.referer,
            NotFound:true
        });
    }
    else
    {
        const [Tags, Categories, Categories_sub]  = await Promise.all([db.LoadTag(), db.LoadCategories(), db.LoadSubCategories()]);
        res.render('vwWriter/Update',{
            IsActiveUpdate:true,
            layout: 'homewriter',
            Id:IdPost,
            ListTag:Tags,
            ListCat:Categories,
            ListSubCat:Categories_sub,
            FullCont:Post[0].Content_Full,
            BriefCont:Post[0].Content_Summary,
            Title:Post[0].Title,
            Tag:TagOfPost,
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

router.post('/Update', restrict, Authories, upload.fields([]), async (req,res, next)=>{
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
        const Url =  mark_url(Title) + '-' + Date.now();
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
        
                const regexAvatar = RegExp(`(.*temp*)`)
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
                await db.UpdateFB(IdPost);

                //remove image is not exists in full content 
                const directoryPath = path.join(__dirname, '../public/img/ImagePost/' + IdPost);
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

router.get('/FeedBack_Read/:idPost/:id', restrict, Authories, async (req,res, next)=>{
    try{
        const Id = +req.params.id;
        const IdPost = +req.params.idPost;
        const IsDelete = 0;
        const [Result, Total] = await Promise.all([db.LoadFB(IdPost), CountFB(IdPost, IsDelete)]);
        res.render('vwWriter/feedback_read', {
            layout:'homewriter',
            IsActiveFB:true,
            IsFeedBack:true,
            FeedBackEditor:Result[0].Name,
            FeedBackIdPost:Result[0].IdPost,
            FeedBackContent:Result[0].Note,
            FeedBackDate:Result[0].DatetimeApproval,
            NumberOfFB:Total[0].Number,
            Name:res.locals.lcAuthUser.Username,
            Avatar:res.locals.lcAuthUser.Avatar,
            helpers:{
                format_time:function(value){
                    return moment(value).format('llll');
                }
            }
        });
    }
    catch(e)
    {
        console.log(e);
    }
});

router.get('/FeedBack_Inbox/:id/:page',  restrict, Authories, async (req,res, next)=>{
    try{
        const page = +req.params.page || 1;
        const offset = (page - 1) * config.pagination.limit;
        const IdPost = +req.params.id;
        const IsDelete = 0;
        const [Result, Total] = await Promise.all([db.LoadInboxFB(IdPost, config.pagination.limit, offset, IsDelete), db.CountFB(IdPost, IsDelete)]);   
        const nPages = Math.ceil(Total[0].Number / config.pagination.limit);
        let PageEnd = offset + config.pagination.limit;
        if(PageEnd > Total[0].Number)
        {
            PageEnd = Total[0].Number;
        }
        res.render('vwWriter/feedback_inbox', {
            layout:'homewriter',
            IsActiveFB:true,
            Inbox:Result,
            IdPost,
            IsFeedBack:true,
            NumberOfFB:Total[0].Number,
            TotalPage:Total[0].Number,
            PageCurrent:offset,
            PageEnd,
            Name:res.locals.lcAuthUser.Username,
            Avatar:res.locals.lcAuthUser.Avatar,
            prev_value: page - 1,
            next_value: page + 1,
            can_go_prev: page > 1,
            can_go_next: page < nPages,
            helpers:{
                format_time:function(value){
                    return moment(value).format('llll');
                }
            }
        });
    }
    catch(e)
    {
        console.log(e);
    }
});

router.post('/FeedBack_Inbox/RemoveFeedBack/:id', restrict, Authories, upload.fields([]), async (req, res, next)=>{
    try{
        const IdPost = +req.params.id;
        const checkbox = req.body.checkbox;
        let value = [];
        for(let i = 0; i < checkbox.length; i++)
        {
            let tmp = [];
            tmp.push(+checkbox[i]);
            tmp.push(1);
            value.push(tmp);
        }
        const result = await db.RemoveFB(value);
        console.log(checkbox);
        res.redirect(`/writer/FeedBack_Inbox/${IdPost}/1`);
    }
    catch(e)
    {
        console.log(e);
    }
});

router.get('/TrashFeedBack_Read/:id/:idPost', restrict, Authories, async (req,res, next)=>{
    try{
        const Id = req.params.id;
        const IdPost = req.params.idPost;
        const IsDelete = 1;
        const [Result, Total] = await Promise.all([db.LoadFB(Id), CountFB(IdPost, IsDelete)]);
     
        res.render('vwWriter/feedback_read', {
            layout:'homewriter',
            IsActiveFB:true,
            FeedBackEditor:Result[0].Name,
            FeedBackIdPost:Result[0].IdPost,
            FeedBackContent:Result[0].Note,
            FeedBackDate:Result[0].DatetimeApproval,
            NumberOfTrashFB:Total[0].Number,
            Name:res.locals.lcAuthUser.Username,
            Avatar:res.locals.lcAuthUser.Avatar,
            helpers:{
                format_time:function(value){
                    return moment(value).format('llll');
                }
            }
        });
    }
    catch(e)
    {
        console.log(e);
    }
});

router.get('/TrashFeedBack_Inbox/:id/:page',  restrict, Authories, async (req,res, next)=>{
    try{
        const page = +req.params.page || 1;
        const IdPost = req.params.id;
        const offset = (page - 1) * config.pagination.limit;
        const IsDelete = 1;
        const [Result, Total] = await Promise.all([db.LoadInboxFB(IdPost, config.pagination.limit, offset, IsDelete), db.CountFB(IdPost, IsDelete)]);
        const nPages = Math.ceil(Total[0].Number / config.pagination.limit);
        let PageEnd = offset + config.pagination.limit;
        if(PageEnd > Total[0].Number)
        {
            PageEnd = Total[0].Number;
        }
        res.render('vwWriter/feedback_inbox', {
            layout:'homewriter',
            IsActiveFB:true,
            Inbox:Result,
            IdPost,
            NumberOfTrashFB:Total[0].Number,
            TotalPage:Total[0].Number,
            PageCurrent:offset,
            PageEnd,
            prev_value: page - 1,
            next_value: page + 1,
            can_go_prev: page > 1,
            can_go_next: page < nPages,
            Name:res.locals.lcAuthUser.Username,
            Avatar:res.locals.lcAuthUser.Avatar,
            helpers:{
                format_time:function(value){
                    return moment(value).format('llll');
                }
            }
        });
    }
    catch(e)
    {
        console.log(e);
    }
});


module.exports = router;