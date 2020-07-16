const tagModel = require('../../models/tag.model');

module.exports = (router) =>{
    router.get('/tags', async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'tags') {
              c.isActive = true;
            }
        }
    
        const list = await tagModel.all();
        return res.render('vwAdmin/vwTags/listTag', {
            layout: 'homeadmin',
            tags: list
        });
    });
}