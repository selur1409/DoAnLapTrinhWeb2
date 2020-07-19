const express = require('express');
const router = express.Router();

require('../middlewares/localsAdmin.mdw')(router);
require('./rAdmin/categories.admin.route')(router);
require('./rAdmin/tags.admin.route')(router);
require('./rAdmin/posts.admin.route')(router);
require('./rAdmin/accounts.admin.route')(router);

router.get('/', function(req, res){
    return res.render('vwAdmin/index', {
        layout: 'homeadmin'
    });
});


module.exports = router;