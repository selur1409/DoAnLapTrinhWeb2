const express = require('express');
const accountModel = require('../models/account.model');
const bcrypt = require('bcryptjs');
const config = require('../config/default.json');
const moment = require('moment');
const auth = require('../middlewares/auth.mdw');
//captcha
const request = require('request');
const router = express.Router();
// Trang đăng kí (register)
router.get('/register', auth.referer, function (req, res) {
    res.render('vwAccount/register',{
        layout: false,
        err: req.flash('error'),
        success: req.flash('success')
    });
}) 

router.get('/is-available', auth.referer, async function(req, res){
    if (req.query.username){
        const list = await accountModel.singleId_editAccount(req.query.username);
        if (list.length !== 0)
        {
            return res.json(false);
        }
        return res.json(true);
    }
})

router.post('/register', async function(req, res){

    const rows = await accountModel.singleId(req.body.Username);

    //captcha
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        /*return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});*/
        req.flash('error', 'Please select captcha.');
        return res.redirect('/account/register');
    }

    const secretKey = '6LfNc78ZAAAAAE4eRpe5Myswh-Dd_CMLSDtPJpk8';
    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
            /*return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});*/
            req.flash('error', 'Failed captcha verification.');
            return res.redirect('/account/register');
        }
    });

    if (rows.length !== 0){
        req.flash('error', 'Username already exist.');
        return res.redirect('/account/register');
    }

    // kiểm tra pw vs confirm pw
    if(req.body.Password !== req.body.Confirm)
    {
        req.flash('error', "Password doesn't match.");
        return res.redirect('/account/register');
    }

    if (req.body.Name === "" ||
    isNaN(Date.parse(moment(req.body.DOB, "DD-MM-YYYY").format('MM-DD-YYYY')))||
        req.body.Sex === undefined){
            req.flash('error', "Have a item don't empty.");
            return res.redirect('/account/register');
    }

    // const em = await accountModel.singleEmail(req.body.Email);
    // if (em.length !== 0){
    //     return res.render('vwAccount/register', {
    //         layout: false,
    //         err: "Email already exist."
    //     })
    // }
    
    
    // Lấy ngày giờ hiện tại
    const dt_now = moment().format('YYYY-MM-DD');
    // gia hạn ngày
    var dob = '1999/01/01';
    if (!isNaN(Date.parse(moment(req.body.DOB, "DD-MM-YYYY").format('MM-DD-YYYY')))){
        dob = moment(req.body.DOB, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }

    //Nếu ngày hiện tại <= ngày sinh thì thông báo lỗi
    if (dt_now <= dob)
    {   
        req.flash('error', 'Date of birth is smaller than the current day.');
        return res.redirect('/account/register');
    }    

    const pw_hash = bcrypt.hashSync(req.body.Password, config.authentication.saltRounds);
    const entity_account = {
        Username: req.body.Username,
        Password_hash: pw_hash,
        DateRegister: dt_now,
        TypeAccount: 1,
        IsDelete: 0
    }
    
    await accountModel.add(entity_account);

    const registered = await accountModel.singleId(req.body.Username);
    const id = registered[0].Id;

    const entity_information = {
        Name: req.body.Name,
        DOB: dob,
        IdAccount: id,
        Sex: +req.body.Sex
    }

    await accountModel.addInfor(entity_information);

    req.flash('success', 'Created new account success!!!!');
    return res.redirect('/account/register');
})

// Trang đăng nhập (login)
router.get('/login', auth.referer, function (req, res) {
    res.render('vwAccount/login',{
        layout: false,
        err: req.flash('error'),
        success: req.flash('success')
    });
}) 

router.post('/login', async function (req, res) {
    if (req.body.Username === "" || req.body.Password === ""){
        req.flash('error', 'Please fill data in items.');
        return res.redirect('/account/login');
    }

    //captcha
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        /*return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});*/
        req.flash('error', 'Please select captcha.');
        return res.redirect('/account/login');
    }

    const secretKey = '6LfNc78ZAAAAAE4eRpe5Myswh-Dd_CMLSDtPJpk8';
    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
            /*return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});*/
            req.flash('error', 'Failed captcha verification.');
            return res.redirect('/account/login');
        }
    });

    const rows = await accountModel.single(req.body.Username);

    if (rows.length === 0){
        req.flash('error', 'Tài khoản không tồn tại hoặc mật khẩu không đúng.');
        return res.redirect('/account/login');
    }
    
    const acc = rows[0];
    if (acc.IsGoogle !== 0){
        req.flash('error', 'Tài khoản không tồn tại hoặc mật khẩu không đúng.');
        return res.redirect('/account/login');
    }

    const rs = bcrypt.compareSync(req.body.Password, acc.Password_hash);
    if (rs === false){
        req.flash('error', 'Tài khoản không tồn tại hoặc mật khẩu không đúng.');
        return res.redirect('/account/login');
    }

    delete acc.Password_hash;
    if (acc.Avatar)
    {
      if (acc.Avatar.indexOf("https://") !== -1){
        acc.isGg = true;
      }
    }
    if (acc.DateExpired){
        acc.DateExpired = moment(acc.DateExpired, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
    }
    acc.DOB = moment(acc.DOB, 'YYYY-MM-DD').format('DD-MM-YYYY');

    req.session.isAuthenticated = true;
    req.session.authAccount = acc;

    if (acc.TypeAccount == 1)
    {
        req.session.isSubscriber = true;
    }
    else if (acc.TypeAccount == 2){
        req.session.isWriter = true;
    }
    else if (acc.TypeAccount == 3){
        req.session.isEditor = true;
    }
    else if (acc.TypeAccount == 4){
        req.session.isAdmin = true;
    }

    const url = req.query.retUrl || '/';
    res.redirect(url);
}) 

router.post('/logout', auth.restrict, function (req, res) {
    req.logout();

    req.session.isAuthenticated = false;
    req.session.authAccount = null;
    req.session.isSubscriber = false;
    req.session.isWriter = false;
    req.session.isEditor = false;
    req.session.isAdmin = false;

    res.redirect(req.headers.referer);
})



module.exports = router;