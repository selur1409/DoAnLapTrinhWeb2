const express = require('express');
const router = express.Router();
const {restrict, isAdmin} = require('../middlewares/auth.mdw');

require('../middlewares/localsAdmin.mdw')(router);
require('./rAdmin/categories.admin.route')(router);
require('./rAdmin/tags.admin.route')(router);
require('./rAdmin/posts.admin.route')(router);
require('./rAdmin/accounts.admin.route')(router);

router.get('/', restrict, isAdmin, function(req, res){
    return res.redirect('/admin/accounts');
    // return res.render('vwAdmin/index', {
    //     layout: 'homeadmin'
    // });
});


module.exports = router;