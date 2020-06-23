const express = require('express');
const router = express.Router();
const db = require('../models/Writer');
const config = require('../config/default.json');
const moment = require('moment');
moment.locale("vi");

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


  /*News*/
router.get('/forgotPW.html', (req, res)=>{
    res.render('ForgotPassword',{Message:''});
});

router.post('/forgotPassword', async (req, res, next)=>{
    try{
        const value = ['Email', req.body.email];
        const Email = await db.loadAccount(value);
        console.log(Email);
        if (Email.length === 0) {
            return res.json({ status: 'ok' });
        }
        const value1 = ['Used', 1, 'Email', `${Email[0].Email}`];
        await db.UpdateToken(value1);
        const Token = genRandomString();
        let ExpireDate = new Date();
        ExpireDate.setHours(ExpireDate.getHours() + 1);
        const tmp = dateFormat(ExpireDate, 'yyyy/mm/dd HH:mm:ss');
        await db.InsertToken(['Email', 'Token', 'Expiration', 'Used', `${Email[0].Email}`, `${Token}`, `${tmp}`, 0]);

        const message = {
            from: '1760343@student.hcmus.edu.vn',
            to: Email[0].Email,
            replyTo: 'anhkhuong1306@gmail.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://localhost:3000/reset/?token=' + Token + '&email=' + Email[0].Email + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }

        const smtpTransport = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: '1760343@student.hcmus.edu.vn',
                pass: 'sendgrid123'
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        smtpTransport.sendMail(message, function (err, info) {
            if (err) { console.log(err) }
            else { console.log(info); }
        });
        res.redirect('/forgotPW.html')
        // {Message:'An email has been sent to '+Email[0].Email+' with further instruction'}
    }
    catch(e)
    {
        console.log(e);
    }
});

router.get('/reset/', async(req, res, next)=>{
    sess = req.session;
    const token = req.query.token;
    const email = req.query.email;
    const date = Date.now();
    const value = ['Email', `${email}`, 'Token', `${token}`, 'Used', 0, `${date}`];
    const result = await db.LoadToken(value);
    if(result === null)
    {
        return res.render('/forgotPassword',{Message:'Token has expired. Please try password reset again.'});
    }
    req.session.Email = email;
    res.render('ResetPassword');
});

router.post('/reset/', async(req, res, next)=>{
    sess = req.session;
    const password = req.body.NewPassword;
    const value = ['Password', `${password}`, 'Email', `${sess.Email}`];
    await db.UpdatePassword(value);
    res.send('success');
}); 

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
        const IdAccount = 1;

        let Temp = [];
        const ValueOfPost = ['Title', 'Content_Summary', 'Content_Full', 'DatePost', 'Avatar', 'Views', 'DatetimePost', 'IdCategories', 'IdStatus', 'IsDelete', `${Title}`, `${BriefContent}`, `${FullContent}`, `${DatePost}`, `${Avatar}`, `${View}`, `${DateTimePost}`, `${IdCategories}`, `${IdStatus}`, `${IsDelete}`]
        const Result = await db.InsertPost(ValueOfPost);
        const ValueOfPostDetail = ['IdPost', 'Content_Full', 'IdAccount', `${Result.insertId}`, `${FullContent}`, `${IdAccount}`];
        await db.InsertPostDetail(ValueOfPostDetail);
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

        console.log(Temp);
        console.log(DatePost);
        console.log(DateTimePost);
        console.log(IdCategories);
        console.log(req.body.BriefCont);
        console.log(req.body.FullCont);
        console.log(Result.insertId);
        
    }
    catch(e)
    {
        console.log(e);
    }
}); 

router.get('/ViewPost/:IdStatus', async (req, res)=>{
    const IdAccount = 1;
    const IdStatus = req.params.IdStatus;
    const Result = await db.LoadPostOfWriter(IdStatus, IdAccount);
    res.render('vwWriter/PostOfWriter', {
        layout:'homewriter',
        empty: Result.length === 0,
        ListPosts: Result,

    });
});

router.get('/DetailPost/', async (req, res)=>{
    const IdPost = req.query.id;
    const Post = await db.LoadSinglePost(IdPost);
    const Status = await db.LoadStatusById(Post[0].IdStatus);
    const Categories = await db.LoadCategoriesById(Post[0].IdCategories);
    res.json({Post, Status, Categories});
});

module.exports = router;