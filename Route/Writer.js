const express = require('express');
const router = express.Router();
const db = require('../Models/Writer');
const moment = require('moment');
moment.locale("vi");

router.get('/Writer', async (req,res)=>{
    try{
        const [Tags, Categories, Categories_sub]  = await Promise.all([db.LoadTag(), db.LoadCategories(), db.LoadSubCategories()]);
        res.render('vwWriter/Post',{
            layout:'homewriter', 
            ListTag:Tags,
            ListCat:Categories,
            ListSubCat:Categories_sub
        });
    }
    catch(e)
    {
        console.log(e);
    }
}); 

router.post('/Writer', async (req,res)=>{
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

        let Temp = [];
        const ValueOfPost = ['Title', 'Content_Summary', 'Content_Full', 'DatePost', 'Avatar', 'Views', 'DatetimePost', 'IdCategories', 'IdStatus', 'IsDelete', `${Title}`, `${BriefContent}`, `${FullContent}`, `${DatePost}`, `${Avatar}`, `${View}`, `${DateTimePost}`, `${IdCategories}`, `${IdStatus}`, `${IsDelete}`]
        const Result = await db.InsertPost(ValueOfPost);
        for(let i = 0; i < checkbox.length; i++)
        {
            let Tag_Post = [];
            Tag_Post.push(Result.insertId);
            Tag_Post.push(parseInt(checkbox[i]));
            Temp.push(Tag_Post);
        }
        const ValueOfTagPost = ['IdPost', 'IdTag', Temp];
        await db.InsertTagPost(ValueOfTagPost);
        res.send("Success");

        // console.log(Temp);
        // console.log(DatePost);
        // console.log(DateTimePost);
        // console.log(IdCategories);
        // console.log(req.body.BriefCont);
        // console.log(req.body.FullCont);
        // console.log(checkbox);
        
    }
    catch(e)
    {
        console.log(e);
    }
}); 

module.exports = router;