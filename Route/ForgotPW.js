const express = require('express');
const router = express.Router();
const db = require('../models/account.model');
const config = require('../config/default.json');
const moment = require('moment');
const nodemailer = require('nodemailer');
const flash = require('express-flash');
moment.locale("vi");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const session = require('express-session');

router.get('/ForgotPW', (req, res)=>{
    res.render('vwAccount/ForgotPassword',{
        Fail: req.flash('Fail'),
        Success: req.flash('Success'), 
        layout: false
        });
});

router.post('/ForgotPW', async (req, res, next)=>{
    try{
        const Email = req.body.email;
        const Result = await db.LoadAccount([Email]);
        if (Result.length === 0) {
            req.flash('Fail', 'Email is invalid.');
            return res.redirect('/account/ForgotPW');
        }
        const value1 = ['Used', 1, 'Email', `${Result[0].Email}`];
        await db.UpdateToken(value1);
        const Token = crypto.randomBytes(Math.ceil(32 / 2)).toString('hex').slice(0, 32);
        let ExpireDate = new Date();
        ExpireDate.setHours(ExpireDate.getHours() + 1);
        const tmp = moment(ExpireDate).format('YYYY-MM-DD HH:mm:ss');
        await db.InsertToken(['Email', 'Token', 'Expiration', 'Used', `${Result[0].Email}`, `${Token}`, `${tmp}`, 0]);

        const message = {
            from: '1760343@student.hcmus.edu.vn',
            to: Result[0].Email,
            replyTo: 'anhkhuong1306@gmail.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://localhost:3000/account/reset/' + Token + '\n\n' +
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

        req.flash('Success', `An email has been sent to ${Result[0].Email} with further instruction`);
        res.redirect('/account/ForgotPW');
    }
    catch(e)
    {
        console.log(e);
    }
});

router.get('/reset/:token', async(req, res, next)=>{
    const date = Date.now();
    const token = req.params.token;
    const value = ['Token', `${token}`, 'Used', 0, `${date}`];
    const result = await db.LoadToken(value);
    const email = result[0].Email;
    if(email === undefined)
    {
        return res.render('vwAccount/ResetPassword',{Fail:req.flash('Fail'), layout:false});
    }
    if (result === null) {
        req.flash("Fail",'Token has expired. Please try password reset again.');
        return res.redirect('/account/ForgotPW');
    }
    req.session.Email = email;
    res.render('vwAccount/ResetPassword', {layout:false});
});

router.post('/reset/', async(req, res, next)=>{
    const Password = req.body.NewPassword;
    const RePassword = req.body.RePassword;
    const Email = req.session.Email;
    if(Email === undefined)
    {
        return res.json({fail:'Your email is invalid.'});
    }
    if(Password !== RePassword)
    {
        return res.json({fail:"Re-Password not match"});
    }
    const Date = moment().format('YYYY-MM-DD HH:MM:SS');
    const ValueOfToken = ['Used', 1, Date];
    const pw_hash = bcrypt.hashSync(Password, config.authentication.saltRounds);
    const valueOfPassword = [`${pw_hash}`, `${Email}`];
    await Promise.all([db.UpdatePassword(valueOfPassword), db.DeleteToken(ValueOfToken)]);
    req.session.destroy(function(){
        console.log("session is destroyed");
    });
    res.json({success:'Success! Your password has been changed.'});
}); 

module.exports = router;