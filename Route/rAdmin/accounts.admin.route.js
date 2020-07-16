

module.exports = (router) => {
    router.get('/accounts', function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'accounts') {
              c.isActive = true;
            }
        }
    
        return res.render('vwAdmin/vwAccount/listAccount', {
            layout: 'homeadmin'
        });
    });
}