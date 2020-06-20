const express = require('express');
const accountModel = require('../models/account.model');

const router = express.Router();

// Trang đăng kí (register)
router. get('/register', function (req, res) {
    res.render('vwAccount/register',{
    layout: false
    });
}) 
router.post('/register', function(req, res){
    // xử lý đăng kí
})

module.exports = router;