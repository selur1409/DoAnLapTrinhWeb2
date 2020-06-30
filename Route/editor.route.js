const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    res.render('vwEditor/listPost', {
        layout: 'homeeditor'
    })
});
module.exports = router;