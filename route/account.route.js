const express = require('express');
const accountModel = require('../models/account.model');
const bcrypt = require('bcryptjs');
const config = require('../config/default.json');
const moment = require('moment');
const auth = require('../middlewares/auth.mdw');


const router = express.Router();

// Trang đăng kí (register)
router. get('/register', auth.referer, function (req, res) {
    res.render('vwAccount/register',{
    layout: false
    });
}) 
router.post('/register', async function(req, res){
    const rows = await accountModel.singleId(req.body.Username);

    if (rows.length !== 0){
        return res.render('vwAccount/register', {
            layout: false,
            err: "Username already exist."
        })
    }

    // kiểm tra pw vs confirm pw
    if(req.body.Password !== req.body.Confirm)
    {
        return res.render('vwAccount/register', {
            layout: false,
            err: "Password doesn't match."
        })
    }

    if (req.body.Name === "" ||
        moment(req.body.DOB, "DD/MM/YYYY").isValid === false||
        req.body.Email === "" ||
        req.body.Sex === undefined){
            return res.render('vwAccount/register', {
                layout: false,
                err: "Have a item don't empty."
            })
    }

    const em = await accountModel.singleEmail(req.body.Email);
    if (em.length !== 0){
        return res.render('vwAccount/register', {
            layout: false,
            err: "Email already exist."
        })
    }
    
    
    
    // Lấy ngày giờ hiện tại
    const dt_now = moment().format('YYYY-MM-DD HH:mm:ss');
    // gia hạn ngày
    const dt_expired = moment(dt_now).add(config.momentDefault.NumberTime, config.momentDefault.Duration.Days).format('YYYY-MM-DD HH:mm:ss');

    const dob =  moment(req.body.DOB, 'DD/MM/YYYY').format('YYYY-MM-DD');

    // Nếu ngày hiện tại <= ngày sinh thì thông báo lỗi
    if (dt_now <= dob)
    {
        return res.render('vwAccount/register', {
            layout: false,
            err: "Date of birth is smaller than the current day."
        })
    }    

    const pw_hash = bcrypt.hashSync(req.body.Password, config.authentication.saltRounds);
    const entity_account = {
        Username: req.body.Username,
        Password_hash: pw_hash,
        DateRegister: dt_now,
        DateExpired: dt_expired,
        TypeAccount: 1,
        IsDelete: 0
    }
    
    await accountModel.add(entity_account);

    const registered = await accountModel.singleId(req.body.Username);
    const id = registered[0].Id;

    var phone = "0123456789";
    if (req.body.Phone !== ""){
        phone = req.body.Phone;
    }

    const entity_information = {
        Name: req.body.Name,
        DOB: dob,
        Email: req.body.Email,
        Phone: phone,
        IdAccount: id,
        Sex: req.body.Sex
    }

    await accountModel.addInfor(entity_information);

    res.render('vwAccount/register', {
        layout: false,
        success: 'Created new account success!!!!'
    })
})

// Trang đăng nhập (login)
router.get('/login', auth.referer, function (req, res) {
    res.render('vwAccount/login',{
        layout: false
    });
}) 

router.post('/login', async function (req, res) {
    if (req.body.Username === "" || req.body.Password === ""){
        return res.render('vwAccount/login',{
            layout: false,
            err: 'Please fill data in items'
        })
    }

    const rows = await accountModel.single(req.body.Username);

    if (rows.length === 0){
        return res.render('vwAccount/login', {
            layout: false,
            err: 'Username already not exist or Password incorrect.'
        })
    }
    
    const acc = rows[0];
    
    const rs = bcrypt.compareSync(req.body.Password, acc.Password_hash);
    if (rs === false){
        return res.render('vwAccount/login', {
            layout: false,
            err: 'Username already not exist or Password incorrect.'
        })
    }

    delete acc.Password_hash;

    req.session.isAuthenticated = true;
    req.session.authAccount = acc;

    const url = req.query.retUrl || '/';
    res.redirect(url);
}) 

router.post('/logout', auth.restrict, function (req, res) {
    req.session.isAuthenticated = false;
    req.session.authUser = null;

    res.redirect(req.headers.referer);
})

module.exports = router;