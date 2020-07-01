const express = require('express');
const router = express.Router();
const db = require('../models/Writer');
const flash = require('express-flash');
const config = require('../config/default.json');
const moment = require('moment');
moment.locale("vi");
const {restrict, referer} = require('../middlewares/auth.mdw');
const { route } = require('./account.route');
const { CountFB } = require('../models/Writer');
const { query } = require('express');

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

router.get('/Writer', restrict, Authories, async (req,res)=>{
    try{

        const [Tags, Categories, Categories_sub] = await Promise.all([db.LoadTag(), db.LoadCategories(), db.LoadSubCategories()]);
        res.render('vwWriter/Post', {
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

router.post('/Writer', restrict, Authories, async (req,res, next)=>{
    try{

        let checkbox = JSON.parse(req.body.arrCheck);
        const IsDelete = 0;
        const IdStatus = 4;
        const DatePost = moment().format('YYYY-MM-DD HH:mm:ss');
        const DateTimePost = null;
        const View = 0;
        const Avatar = null;
        const IdCategories = req.body.Categories;
        const Title = req.body.Title;
        const FullContent = req.body.FullCont;
        const BriefContent = req.body.BriefCont;
        const IdAccount = res.locals.lcAuthUser.Id;
    
        if (checkbox.length === 0 || IdCategories === '' || FullContent === '' || BriefContent === '' || Title === '') {
            res.json({ fail: 'Please complete all fields in the form' });
        }
        else {

            let Temp = [];
            const ValueOfPost = ['Title', 'Content_Summary', 'Content_Full', 'DatePost', 'Avatar', 'Views', 'DatetimePost', 'IdCategories', 'IdStatus', 'IsDelete', `${Title}`, `${BriefContent}`, `${FullContent}`, `${DatePost}`, `${Avatar}`, `${View}`, `${DateTimePost}`, `${IdCategories}`, `${IdStatus}`, `${IsDelete}`]
            const Result = await db.InsertPost(ValueOfPost);
            const ValueOfPostDetail = ['IdPost', 'Content_Full', 'IdAccount', `${Result.insertId}`, `${FullContent}`, `${IdAccount}`];
            await db.InsertPostDetail(ValueOfPostDetail);

            for (let i = 0; i < checkbox.length; i++) {
                let Tag_Post = [];
                Tag_Post.push(Result.insertId);
                Tag_Post.push(parseInt(checkbox[i]));
                Temp.push(Tag_Post);
            }

            const ValueOfTagPost = ['IdPost', 'IdTag', Temp];
            const result = await db.InsertTagPost(ValueOfTagPost);
            if (result !== null) {
                res.json({ success: 'This article has been sent successfully!' });
            }
            // console.log(Temp);
            // console.log(DatePost);
            // console.log(DateTimePost);
            // console.log(IdCategories);
            // console.log(req.body.BriefCont);
            // console.log(req.body.FullCont);
            // console.log(Result.insertId);
        }
    }
    catch(e)
    {
        console.log(e);
    }
}); 

router.get('/ViewPost/:id/:page', restrict, Authories, async (req, res)=>{
    const page = +req.params.page || 1;
    const IdAccount = res.locals.lcAuthUser.Id;
    const IdStatus = +req.params.id || 4;

    const offset = (page - 1) * config.pagination.limit;
    const [Result, Total, NumberOfPost] = await Promise.all([db.LoadPostOfWriter(IdStatus, IdAccount, config.pagination.limit, offset), db.CountPostOfWriter(IdStatus, IdAccount), db.CountNumberPost(IdAccount)]);
    const Name = res.locals.lcAuthUser.Username;
    
    const nPages = Math.ceil(Total[0].Number / config.pagination.limit);
    const page_items = [];
    let count = 0;
    let lengthPagination = 0;
    let temp = page;

    while(true)
    {
        if(temp - config.pagination.limitPaginationLinks > 0)
        {
            count++;
            temp = temp - config.pagination.limitPaginationLinks;
        }      
        else{
            break;
        }
    }
    if((count * config.pagination.limitPaginationLinks) + config.pagination.limitPaginationLinks >= nPages)
    {
        lengthPagination = nPages;  
    } 
    else  
    {
        lengthPagination =  (count * config.pagination.limitPaginationLinks) + config.pagination.limitPaginationLinks;
    }  
    for(let i = (count * config.pagination.limitPaginationLinks) + 1; i <= lengthPagination; i++)
    {
        const item = {
            value: i,
            isActive: i === page,
            IdStatus
        }
        page_items.push(item);
    }

    res.render('vwWriter/PostOfWriter', {
        layout:'homewriter',
        empty: Result.length === 0,
        IsActive:true,
        Name,
        Avatar:res.locals.lcAuthUser.Avatar,
        IdStatus,
        IsActive1:IdStatus === 1,
        IsActive2:IdStatus === 2,
        IsActive3:IdStatus === 3,
        IsActive4:IdStatus === 4,
        ListPosts: Result,
        helpers:{
            format_datetime: function (value) {
                const date = moment(value).format("DD-MM-YYYY HH:MM TT");
                return date;
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
        last:nPages

    });
});

router.get('/DetailPost/', restrict, Authories, async (req, res)=>{
    const IdPost = req.query.id;
    const Post = await db.LoadSinglePost(IdPost);
    const Status = await db.LoadStatusById(Post[0].IdStatus);
    const Categories = await db.LoadCategoriesById(Post[0].IdCategories);
    res.json({Post, Status, Categories});
});

router.get('/Update/:id', restrict, Authories, async (req, res)=>{
    const IdPost = req.params.id;
    const Post = await db.LoadSinglePost(IdPost);
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

router.post('/Update/', restrict, Authories, async (req,res, next)=>{
    try{
        let checkbox = JSON.parse(req.body.arrCheck);
        const IdPost = +req.query.id;
        const IsDelete = 0;
        const IdStatus = 4;
        const DatePost = moment().format('YYYY-MM-DD HH:mm:ss');
        const DateTimePost = null;
        const View = 0;
        const Avatar = null;
        const IdCategories = req.body.Categories;
        const Title = req.body.Title;
        const FullContent = req.body.FullCont;
        const BriefContent = req.body.BriefCont;
        const IdAccount = res.locals.lcAuthUser.Id;
    
        if(checkbox.length === 0 || IdCategories === '' || FullContent === '' || BriefContent === '' || Title === '')
        {
            res.json({fail:' Please complete all fields in the form'});
        }
        else{
            const ValueOfPost = [`${Title}`, `${BriefContent}`, `${FullContent}`, `${DatePost}`, `${Avatar}`, `${View}`, `${DateTimePost}`, `${IdCategories}`, `${IdStatus}`, `${IsDelete}`, `${IdPost}`];
            const Result = await db.UpdatePostOfWriter(ValueOfPost);
            await db.UpdatePostDetail(FullContent, IdPost);
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
            if (result !== null) {
                res.json({success:'This article has been sent successfully!'});
            }
        }
    
        // console.log(IdPost);
        // console.log(checkbox);
        // console.log(DatePost);
        // console.log(DateTimePost);
        // console.log(IdCategories);
        // console.log(req.body.BriefCont);
        // console.log(req.body.FullCont);
    }
    catch(e)
    {
        console.log(e);
    }
}); 

router.get('/FeedBack_Read/:id/:idPost', restrict, Authories, async (req,res, next)=>{
    try{
        const Id = req.params.id;
        const IdPost = req.params.idPost;
        const IsDelete = 0;
        const [Result, Total] = await Promise.all([db.LoadFB(Id), CountFB(IdPost, IsDelete)]);
     
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
        const IdPost = req.params.id;
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

router.post('/FeedBack_Inbox/RemoveFeedBack/:id', async (req, res, next)=>{
    try{
        const IdPost = req.params.id;
        const checkbox = req.body.checkbox;
        let value = [];
        for(let i = 0; i < checkbox.length; i++)
        {
            let tmp = [];
            tmp.push(+checkbox[i]);
            tmp.push(1);
            value.push(tmp);
        }
        console.log(value);
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