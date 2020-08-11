const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const config = require('../config/default.json');
let upload = multer();
const moment = require('moment'); moment.locale("vi");
const fs = require('fs');
const path = require('path');
const db = require('../models/Writer');
const account = require('../models/account.model');
const {restrict, referer} = require('../middlewares/auth.mdw');

function Authories(req, res, next)
{
    if (!req.session.isAuthenticated) {
        return res.redirect(`/account/login`);
    }
    next();
}

router.get('/Profile/:TypeAccount', Authories, async (req, res, next)=>{
    try{
        const TypeAccount = +req.params.TypeAccount;
        let TypeLayout = '';
        if(TypeAccount === 1)
        {
            TypeLayout = 'homeuser';
        }
        else if(TypeAccount === 2)
        {
            TypeLayout = 'homewriter';
        }
        else if(TypeAccount === 3)
        {
            TypeLayout = 'homeeditor';
        }
        else if(TypeAccount === 4)
        {
            TypeLayout = 'homeadmin';
        }
        const IdAccount = res.locals.lcAuthUser.Id;
        const [AccountProfile, NumberOfPost]  = await Promise.all([db.LoadProfile(IdAccount), db.CountAllPost(IdAccount)]);
        req.session.authAccount = AccountProfile[0];

<<<<<<< HEAD
=======
        var isGg = false;
        if (AccountProfile[0].Avatar){
            if (AccountProfile[0].Avatar.indexOf("https://") !== -1){
                isGg = true;
            }
        }

>>>>>>> b4af9ecdce7b3be42c39a20763eeb451d7129b9c
        res.render('vwAccount/profile',{
            layout: TypeLayout,
            Username:AccountProfile[0].Username,
            Name:AccountProfile[0].Name,
            Nickname:AccountProfile[0].Nickname,
            DateOfBirth: moment(AccountProfile[0].DOB).format('DD/MM/YYYY'),
            Email:AccountProfile[0].Email,
            Phone:AccountProfile[0].Phone,
            Male:AccountProfile[0].Sex === 0,
            Female:AccountProfile[0].Sex === 1,
            Avatar:AccountProfile[0].Avatar,
            AvatarEmpty:AccountProfile[0].Avatar === null,
            NumberOfPost:NumberOfPost[0].Number,
            IsActiveProfile:true,
            IsNotUser:TypeAccount !== 1,
            IsWriter:TypeAccount === 2,
            TypeAccount:AccountProfile[0].Type,
            isGg: isGg
        });
    }
    catch(e){
        console.log(e);
    }
});

router.post('/Profile/', Authories, async (req, res, next)=>{
    
    let Name = '';
    let Email = '';
    let DOB = '';
    let Phone = '';
    let Nickname = '';
    let Avatar = '';
    let Sex = '';
    const IdAccount = res.locals.lcAuthUser.IdAccount;

    try{
        const option = +req.query.opt;
       if(option === 1)
       {
            const storage = multer.diskStorage({
                filename(req, file, cb) {
                    cb(null, IdAccount + path.extname(file.originalname));
                },
                destination(req, file, cb) {
                    cb(null, './public/img/Avatar');
                }
            });

            const upload = multer({ storage, 
                fileFilter: function (req, file, cb) {
                    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
                        req.fileValidationError = 'Only image files are allowed!';
                        return cb(new Error('Only image files are allowed!'), false);
                    }
                    cb(null, true);
                }
            });

            upload.single('Avatar')(req, res, async error => {
                if(error)
                {
                    console.log(error);
                }
                else
                {
                    Name = req.body.Name;
                    DOB = req.body.DOB;
                    Email = req.body.Email;
                    Phone = req.body.Phone; 
                    Nickname = req.body.Nickname;
                    Sex = req.body.Sex === true ? 0 : 1;
                    Avatar = req.file !== undefined ? IdAccount + path.extname(req.file.originalname) : res.locals.lcAuthUser.Avatar;   
                    const CheckMail = await db.CheckMailIsExists(IdAccount, Email);
                    const RegexEmail = new RegExp('^[A-Za-z0-9_.]{4,32}@([a-zA-Z0-9]{2,12})(.[a-zA-Z]{2,12})+$');
                    if (Name === "" ||
                        moment(DOB, "DD/MM/YYYY").isValid === false ||
                        Email === "") {
                        res.json({ fail: "These fields cannot not be emtpy!" });
                    }
                    else if(CheckMail.length !== 0 || RegexEmail.test(Email) === false)
                    {
                        res.json({ fail: "Email has already exsist or not valid!" });
                    }
                    else {
                        const dt_now = moment().format('YYYY-MM-DD');
                        DOB = moment(DOB, "DD/MM/YYYY").format('YYYY-MM-DD');

                        const IdAccount = res.locals.lcAuthUser.IdAccount;

                        const value = [`${Name}`, `${Nickname}`, `${DOB}`, `${Email}`, `${Phone}`, `${Avatar}`, `${Sex}`, `${IdAccount}`];
                        if (DOB > dt_now) {
                            res.json({ fail: 'Your birthday cannot be greater than current date' });
                        }
                        else {
                            const result = await db.UpdateProfile(value);
                            if (result.affectedRows === 0) {
                                res.json({ fail: 'Your birthday cannot be greater than current date' });
                            }
                            else {
                                res.json({ success: "The change process is successful" });
                            }
                        }
                    }
                }
            });
       }
       else if(option === 2)
       {
            upload.fields([])(req, res, async error => {
                if(error)
                {
                    console.log(error);
                }
                else
                {
                    const Result = await account.single(res.locals.lcAuthUser.Username);
                    const verification = bcrypt.compareSync(req.body.CurrentPassword, Result[0].Password_hash);
                    const Id = res.locals.lcAuthUser.Id;
                    if(req.body.NewPassword !== req.body.ConfirmNewPassword)
                    {
                        res.json({fail: 'Confirmation password does not match the New Password'});
                    }
                    else if(verification === false)
                    {   
                        res.json({fail: 'Your current password is incorrect'});
                    }
                    else
                    {
                        const NewPassword = bcrypt.hashSync(req.body.NewPassword, config.authentication.saltRounds);
                        const ValuePassword = [`${NewPassword}`, `${Id}`];
                        await db.UpdatePassword(ValuePassword);
                        res.json({success: "The change process is successful"});
                    }
                }
            });
       }
    }
    catch(e){
        console.log(e);
    }
});

module.exports = router;
