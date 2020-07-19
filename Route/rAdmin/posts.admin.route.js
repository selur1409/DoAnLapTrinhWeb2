

module.exports = (router) => {
    router.get('/posts', function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'posts') {
              c.isActive = true;
            }
        }
    
        return res.render('vwAdmin/vwPosts/listPost', {
            layout: 'homeadmin'
        });
    });
}