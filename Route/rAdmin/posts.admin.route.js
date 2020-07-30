const postModel = require('../../models/post.model');
const moment = require('moment');
const statusModel = require('../../models/statuspost.model');
const {getTimeBetweenDate} = require('../../js/betweendate');
const db = require('../../models/Writer');
module.exports = (router) => {
    router.get('/posts', async function(req, res){
        for (const c of res.locals.lcManage) {
            if (c.link === 'posts') {
              c.isActive = true;
            }
        }

        const status = +req.query.status || 0;
        var listStatus = await statusModel.all();
        listStatus.splice(0, 0, {Id: 0, Name: "Tất cả"});

        if (status < 0 || status > listStatus.length)
        {
            return res.redirect('/admin/posts');
        }

        for (l of listStatus){
            if (l.Id === status){
                l.isActive = true;
            }
            const number = await postModel.countStatus(l.Id);
            l.number_of_status = number[0].Number;
        }

        var list= [];

        if (status !== 0){
            list = await postModel.dislayList_Status(status);
        }
        else{
            list = await postModel.dislayList();
        }
        
        for (i = 0; i < list.length; i++){
            list[i].DatetimePost = moment(list[i].DatetimePost, 'YYYY/MM/DD HH:mm:ss').format('HH:mm:ss DD-MM-YYYY');
            list[i].sttSelect = status;
        }
        
        return res.render('vwAdmin/vwPosts/listPost', {
            layout: 'homeadmin',
            posts: list,
            empty: list.length === 0,
            status: listStatus
        });
    });
    
    router.get('/posts/status', async function(req, res){
        const status = req.query.number;
        const url = req.query.url;
        const posts = await postModel.single_url(url);
        const select = +req.query.select || posts[0].IdStatus;
        const listStatus = await statusModel.all();

        for (l of listStatus){
            l.number = status;
            l.url = url;
            if (l.Id === select)
                l.selected = true;
        }
            

        return res.render('vwAdmin/vwPosts/statusPost', {
            layout: 'homeadmin',
            status: status,
            post: posts[0],
            listStatus
        })
    })

}