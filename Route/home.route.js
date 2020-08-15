const config = require('../config/default.json');
const express = require('express');
//sửa require postModel (require('../models/post.model') -> require('../Models/post.model'))
const postModel = require('../Models/post.model');
const tagModel = require('../Models/tag.model');
const commentModel = require('../Models/comment.model');
const moment = require('moment');
const querystring = require('querystring');
const puppeteer = require('puppeteer');
const { restrict } = require('../middlewares/auth.mdw');
//sửa require categoriesModel (require('../models/category.model') -> require('../Models/category.model'))
const categoriesModel = require('../Models/category.model');
const {getTimeBetweenDate} = require('../js/betweendate');
const {getTime_Minutes} = require('../js/betweendate');
const {addMinutes}= require('../config/default.json');
const accountModel = require('../models/account.model');
const router = express.Router();
const printPdf = async(htmlPage)=>{
    // //.log('Starting: Generating PDF Process, Kindly wait ..');
	/** Launch a headleass browser */
	const browser = await puppeteer.launch();
	/* 1- Ccreate a newPage() object. It is created in default browser context. */
	const page = await browser.newPage();
	/* 2- Will open our generated `.html` file in the new Page instance. */
    // await page.goto(buildPathHtml, { waitUntil: 'networkidle0' });
    await page.setContent(htmlPage);
	/* 3- Take a snapshot of the PDF */
	const pdf = await page.pdf({
		format: 'A4',
		margin: {
			top: '20px',
			right: '20px',
			bottom: '20px',
			left: '20px'
		}
	});
	/* 4- Cleanup: close browser. */
	await browser.close();
	// //.log('Ending: Generating PDF Process');
	return pdf;
}

// Trang index
router.get('/',async function (req, res) {

    let IsLogin = false;
    let IsAccountPremium = true;
    if(!req.session.isAuthenticated)
    {
        IsLogin = false;
        IsAccountPremium = false;
    }
    else {
        IsLogin = true;


        const dt_now = moment().format('YYYY-MM-DD HH:mm:ss');
        if ((!req.session.authAccount.DateExpired || isNaN(Date.parse(req.session.authAccount.DateExpired))) 
            && res.locals.lcAuthUser.TypeAccount === 1)
                IsAccountPremium = false;
        const dateEx =  moment(req.session.authAccount.DateExpired, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    
    
        if(dateEx <= dt_now && res.locals.lcAuthUser.TypeAccount === 1)
                IsAccountPremium = false;
        
    }

    var listTreding = [];
    var numTrend = 0;
    do
    {
        numTrend = numTrend + config.dayTrend;
        listTreding = await postModel.trending(numTrend);
    }
    while(listTreding.length < 4);



    const listMostView = await postModel.mostview();
    const listPostNew = await postModel.postnew();
    const listCatPostNew = await postModel.categorypostnew();
    const listTag = await tagModel.listTagHome();

    const listRandomSidebar = await postModel.postRandomSideBar();
    const listFutureEvent = await postModel.furuteEvents();
    const listSliderPost = await postModel.SliderPost();


    

   



    for(let i = 0; i < listTreding.length; i++)
    {
        listTreding[i].DatetimePost = moment(listTreding[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for(let i = 0; i < listMostView.length; i++)
    {
        listMostView[i].DatetimePost = moment(listMostView[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for(let i = 0; i < listPostNew.length; i++)
    {
        listPostNew[i].DatetimePost = moment(listPostNew[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for(let i = 0; i < listCatPostNew.length; i++)
    {
        listCatPostNew[i].DatetimePost = moment(listCatPostNew[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for(let i = 0; i < listRandomSidebar.length; i++)
    {
        listRandomSidebar[i].DatetimePost = moment(listRandomSidebar[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    for(let i = 0; i < listFutureEvent.length; i++)
    {
        listFutureEvent[i].DatetimePost = moment(listFutureEvent[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    // khởi tạo biến premium chưa được đăng kí
    var premium = false;
    // Khởi tạo isSubscriber là tài khoản độc giả
    var isSubscriber = true;

    // Kiểm tra đăng nhập
    if (res.locals.lcIsAuthenticated === true){
        // Kiểm tra tài khoản là độc giả
        if (res.locals.lcAuthUser.TypeAccount === 1){
            isSubscriber = true;
            const user = res.locals.lcAuthUser.Username;

            const list = await accountModel.singUsername_Expired(user);
            const account = list[0];
            delete account.Password_hash;
            

                // Tính thời hạn đăng kí premium
            
            if (account.DateExpired)
            {
                const authU = res.locals.lcAuthUser;
                const dt_exp = new Date(moment(account.DateExpired, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
                const dt_now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));

                premium = getTimeBetweenDate(dt_now, dt_exp);
            }
        }
        else
        {
            isSubscriber = false;
        }
    }

    


    // console.log(listTreding);
    res.render('index', {
        Treding: listTreding,
        emptyTreding: listTreding.length === 0,

        MostView: listMostView,
        emptyMostView: listMostView.length === 0,

        PostNew: listPostNew,
        emptyPostNew: listPostNew.length === 0,

        CatPostNew: listCatPostNew,
        emptyCatPostNew: listCatPostNew.length === 0,

        listTag: listTag,
        emptyTag: listTag.length === 0,

        listSliderPost,
        emptySliderPost: listSliderPost.length === 0,
        

        listRandomSidebar, 
        listFutureEvent,
        emptyFutureEvent: listFutureEvent.length === 0,
        isSubscriber: isSubscriber,
        Premium: premium,
        IsLogin,
        IsAccountPremium,
        helpers: {
            load_Post1: function(context, options)
            {
                return options.fn(context[0]);
            },
            load_Post2: function(context, options)
            {
                let ret = "";
                for(let i = 1; i < context.length; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            },
            loadListRandomSideBar_1: function(context, options)
            {
                let ret = "";
                for(let i = 0; i < 4; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_2: function(context, options)
            {
                let ret = "";
                for(let i = 4; i < 8; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_3: function(context, options)
            {
                let ret = "";
                for(let i = 8; i < 12; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            },
            convertMonth: function(value)
            {
                     if(value == 1) return "Jan";
                else if(value == 2) return "Feb";
                else if(value == 3) return "Mar";
                else if(value == 4) return "Apr";
                else if(value == 5) return "May";
                else if(value == 6) return "Jun";
                else if(value == 7) return "Jul";
                else if(value == 8) return "Aug";
                else if(value == 9) return "Sep";
                else if(value == 10) return "Oct";
                else if(value == 11) return "Nov";
                else if(value == 12) return "Dec";
                else return "?";
            }
        }

    });

})

router.get('/premium/register', restrict, async function(req, res){
    if(res.locals.lcAuthUser.TypeAccount!==1){
        return res.redirect('/');
    }
    // khởi tạo biến premium chưa được đăng kí
    var premium = false;
    // Khởi tạo isSubscriber là tài khoản độc giả
    var isSubscriber = true;

    var time;
    var minutes = addMinutes;
    time = getTime_Minutes(minutes);
    time.value = +minutes || 1;

    const user = res.locals.lcAuthUser.Username;
    const list = await accountModel.singUsername_Expired(user);
    const account = list[0];
        // Tính thời hạn đăng kí premium
    if (account.DateExpired)
    {
        const dt_exp = new Date(moment(account.DateExpired, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
        const dt_now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
        premium = getTimeBetweenDate(dt_now, dt_exp);
    }
    
    return res.render('vwPremium/register', {
        layout: false,
        time: time,
        isSubscriber: isSubscriber,
        Premium: premium,
        err: req.flash('error'),
        success: req.flash('success'),
        retUrl: req.query.retUrl
    })
})

router.post('/premium/register', restrict,async function(req, res){
    const username = req.body.Username;
    const list = await accountModel.singUsername_Expired(username);
    if (list.length === 0){
        return res.redirect('/');
    }
    const user = list[0];

    if (user.DateExpired)
    {
        const dt_exp = new Date(moment(user.DateExpired, 'YYYY/MM/DD HH:mm:ss'));
        const dt_now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
        user.premium = getTimeBetweenDate(dt_now, dt_exp);
    }

    var date_expired = moment().add(req.body.Time, 'm').format('YYYY:MM:DD H:mm:ss');

    if (user.premium)
    {
        if (!user.premium.Notvalue)
        {
            date_expired = moment(user.DateExpired, 'YYYY/MM/DD HH:mm:ss').add(req.body.Time, 'm').format('YYYY:MM:DD H:mm:ss');
        }
    }   
    const entity = {
        Id: user.Id,
        DateExpired: date_expired
    }
    req.session.authAccount.DateExpired = date_expired;

    await accountModel.patch(entity);

    const returnURL = req.body.returnUrl || '/';
    return res.redirect(returnURL);
})



router.get('/detail/:Url', async function(req, res){

    const url = req.params.Url;

    const posts_cmt = await postModel.single_url_posts(url);
    if (posts_cmt.length === 0){
        req.flash('error', 'Bài viết không tồn tại.');
        return res.redirect('/');
    }

    if (posts_cmt[0].IdStatus !== 2){
        req.flash('error', 'Bài viết chưa được xuất bản.');
        return res.redirect('/');
    }


    const retURL = `/detail/${url}`;
    if(posts_cmt[0].IsPremium === 1){
        if (!req.session.isAuthenticated){
            return res.redirect(`/account/login?retUrl=${retURL}`)
        }
        else
        {
            const dt_now = moment().format('YYYY-MM-DD HH:mm:ss');
            if(!req.session.authAccount.DateExpired && res.locals.lcAuthUser.TypeAccount === 1)
            {
                return res.redirect(`/premium/register?retUrl=${retURL}`);
            }
            const dateEx = moment(req.session.authAccount.DateExpired, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        
            if(dateEx <= dt_now && res.locals.lcAuthUser.TypeAccount === 1)
            {
                return res.redirect(`/premium/register?retUrl=${retURL}`);
            }
                    
        }
    }

    const rows = await postModel.single(url);
    const post = rows[0];
    
    const postRandom = await postModel.postRandomByCategories(post.IdCategories, post.Id);

    const listTag = await tagModel.tagByIdPost(post.Id);
    // const listComment = await commentModel.commentByIdPost(post.Id);

    const listPostTags = await postModel.postTags();
    // const countComment = listComment.length;

    const listRandomSidebar = await postModel.postRandomSideBar();


    // //.log(listRandomSidebar);

    const listFutureEvent = await postModel.furuteEvents();

    for(let i = 0; i < postRandom.length; i++)
    {
        postRandom[i].DatetimePost = moment(postRandom[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for(let i = 0; i < listRandomSidebar.length; i++)
    {
        listRandomSidebar[i].DatetimePost = moment(listRandomSidebar[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    for(let i = 0; i < listFutureEvent.length; i++)
    {
        listFutureEvent[i].DatetimePost = moment(listFutureEvent[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    post.DatetimePost = moment(post.DatetimePost, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
    
    // Bình luận bài viét
    const offset = (+req.body.number || 0) * config.pagination.limit;
    
    const pcmt = posts_cmt[0];
    const listComment = await commentModel.commentByIdPost_admin(pcmt.Id, offset, config.pagination.limit);

    for (l of listComment){
        l.DatetimeComment = moment(l.DatetimeComment, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss DD-MM-YYYY');
        l.Url = url;
    }
    const empty = await commentModel.countCommentByIdPost_admin(pcmt.Id);


    
    let IsLogin = false;
    let IsAccountPremium = true;
    
    if(!req.session.isAuthenticated)
    {
        IsLogin = false;
        IsAccountPremium = false;
    }
    else {
        IsLogin = true;

        const dt_now = moment().format('YYYY-MM-DD HH:mm:ss');
        if (!req.session.authAccount.DateExpired && res.locals.lcAuthUser.TypeAccount === 1)
        {
            // console.log(2);
            IsAccountPremium = false;
        }
        const dateEx = moment(req.session.authAccount.DateExpired, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    
        if(dateEx <= dt_now && res.locals.lcAuthUser.TypeAccount === 1)
        {
            //console.log(3);
            IsAccountPremium = false;
        }
    }   

    const entityPost = {
        Id: post.Id,
        Views: post.Views + 1
    }
    
    ////.log(post.Id + ":" + post.Views);


    await postModel.patch(entityPost);
    
    res.render('vwPost/detailPost', {
        layout: 'detailpost',
        post,
        listTag,
        postRandom,
        // listComment,
        // countComment,
        
        listComment: listComment,
        empty: empty[0].Count,
        more: empty[0].Count > config.pagination.limit,

        emptyPostRandom: postRandom.length === 0,
        listPostTags,
        listRandomSidebar,
        listFutureEvent,
        IsLogin,
        IsAccountPremium,
        emptyFutureEvent: listFutureEvent.length === 0,
        helpers:{
            load_list_tags: function(context, Id, options)
            {
                let ret = "";
                let count = 0;
                for(let i = 0; i < context.length; i++)
                {
                    // //.log(context[i].Id);
                    // //.log(context[i]);
                    if(context[i].IdPost === Id && count < 3)
                    {
                        ret = ret + options.fn(context[i]);
                        count++;
                    }
                }
                return ret;
            },
            loadListRandomSideBar_1: function(context, options)
            {
                let ret = "";
                for(let i = 0; i < 4; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_2: function(context, options)
            {
                let ret = "";
                for(let i = 4; i < 8; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_3: function(context, options)
            {
                let ret = "";
                for(let i = 8; i < 12; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            },
            convertMonth: function(value)
            {
                     if(value == 1) return "Jan";
                else if(value == 2) return "Feb";
                else if(value == 3) return "Mar";
                else if(value == 4) return "Apr";
                else if(value == 5) return "May";
                else if(value == 6) return "Jun";
                else if(value == 7) return "Jul";
                else if(value == 8) return "Aug";
                else if(value == 9) return "Sep";
                else if(value == 10) return "Oct";
                else if(value == 11) return "Nov";
                else if(value == 12) return "Dec";
                else return "?";
            }
        }
    })
});


router.post('/post/comment/load', async function(req, res){
    // //.log(1);
    const url = req.body.url || "empty";
        const posts = await postModel.single_url_posts(url);
        if (posts.length === 0){
            req.flash('error', 'Bài viết không tồn tại.');
            return res.redirect('/admin/posts');
        }
        if (posts[0].IdStatus !== 2){
            req.flash('error', 'Bài viết chưa được xuất bản.');
            return res.redirect('/admin/posts');
        }

        const offset = (+req.body.number || 1) * config.pagination.limit;

        const post = posts[0];
        const listComment = await commentModel.commentByIdPost_admin(post.Id, offset, config.pagination.limit);

    
    for (l of listComment){
        l.DatetimeComment = moment(l.DatetimeComment, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss DD-MM-YYYY');
        l.Url = url;
    }
    
    const empty = await commentModel.countCommentByIdPost_admin(post.Id);
    var more = true;
    if (offset + config.pagination.limit >= empty[0].Count){
        more = false;
    }
    
    const number = +req.body.number + 1;
    
    const data = {
        listComment: listComment,
        number: number,
        more: more
    }
    return res.json(data);
})

router.post('/post/comment/add', async function(req, res){
    const Url = req.body.Url;
    if (!res.locals.lcIsAuthenticated)
    {
        const url = querystring.escape(`/detail/${Url}#cmt`);
        return res.redirect(`/account/login?retUrl=${url}`);
    }
    // {"IdPost":"10","Url":"gioi-thieu-ve-iostream-cout-cin-va-endl-1596752895575","Content":""}
    const IdPost = req.body.IdPost;
    const Content = req.body.Content;
    if (!Content){
        req.flash('error', 'Nội dung bình luận không thể để trống ');
        return res.redirect(`/admin/posts/comment?url=${Url}`);
    }
    
    const DatetimeComment = moment().format('YYYY-MM-DD HH:mm:ss');
    
    const entity = {
        IdPost,
        Content,
        DatetimeComment,
        IsDelete: 0,
        IdAccount: res.locals.lcAuthUser.Id
    }
    await commentModel.add(entity);
    
    return res.redirect(`/detail/${Url}#cmt`);
})

router.get('/search',async function(req, res){
    const ValueSearch = req.query.Search || '';
    const page = +req.query.page || 1;
    const offset = (page - 1) * config.pagination.limitPostPage;


    const [listPost, Total] = await Promise.all([postModel.LoadPostBySearch(config.pagination.limitPostPage, offset, ValueSearch), postModel.CountPostSearch(ValueSearch)]);
    const nPages = Math.ceil(Total[0].Number / config.pagination.limit);


    const page_items = [];
    let count = 0;
    let lengthPagination = 0;
    let temp = page;
    

    while (true) {
        if (temp - config.pagination.limitPaginationLinks > 0) {
            count++;
            temp = temp - config.pagination.limitPaginationLinks;
        }
        else {
            break;
        }
    }
    if ((count * config.pagination.limitPaginationLinks) + config.pagination.limitPaginationLinks >= nPages) {
        lengthPagination = nPages;
    }
    else {
        lengthPagination = (count * config.pagination.limitPaginationLinks) + config.pagination.limitPaginationLinks;
    }
    for (let i = (count * config.pagination.limitPaginationLinks) + 1; i <= lengthPagination; i++) {
        const item = {
            value: i,
            isActive: i === page,
        }
        page_items.push(item);
    }






    const listPostTags = await postModel.postTags();
    const listRandomSidebar = await postModel.postRandomSideBar();
    const listFutureEvent = await postModel.furuteEvents();


    for(let i = 0; i < listRandomSidebar.length; i++)
    {
        listRandomSidebar[i].DatetimePost = moment(listRandomSidebar[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    for(let i = 0; i < listFutureEvent.length; i++)
    {
        listFutureEvent[i].DatetimePost = moment(listFutureEvent[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }

    for(let i = 0; i < listPost.length; i++)
    {
        listPost[i].DatetimePost = moment(listPost[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    
    res.render('vwPost/search', {
        layout: 'listCategoryTag',
        listPost,
        emptyPost: listPost.length === 0,
        listPostTags,
        listRandomSidebar,
        listFutureEvent,
        helpers:{
            load_list_tags: function(context, Id, options)
            {
                let ret = "";
                let count = 0;
                for(let i = 0; i < context.length; i++)
                {
                   
                    if(context[i].IdPost === Id && count < 3)
                    {
                        ret = ret + options.fn(context[i]);
                        count++;
                    }
                }
                return ret;
            },
            loadListRandomSideBar_1: function(context, options)
            {
                let ret = "";
                for(let i = 0; i < 4; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_2: function(context, options)
            {
                let ret = "";
                for(let i = 4; i < 8; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_3: function(context, options)
            {
                let ret = "";
                for(let i = 8; i < 12; i++)
                {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            },
            convertMonth: function(value)
            {
                     if(value == 1) return "Jan";
                else if(value == 2) return "Feb";
                else if(value == 3) return "Mar";
                else if(value == 4) return "Apr";
                else if(value == 5) return "May";
                else if(value == 6) return "Jun";
                else if(value == 7) return "Jul";
                else if(value == 8) return "Aug";
                else if(value == 9) return "Sep";
                else if(value == 10) return "Oct";
                else if(value == 11) return "Nov";
                else if(value == 12) return "Dec";
                else return "?";
            }
        },
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        last: nPages,
        SearchNotEmpty:ValueSearch.length !== 0,
        Search: querystring.escape(ValueSearch),
        SearchKey: ValueSearch,
    })
});


router.get('/ExportPdf/', async function(req, res){
        const IdPost = +req.query.id;
        const content = await postModel.singleById(IdPost);
        const PdfFile = await printPdf(content[0].Content_Full);
        res.setHeader('Content-disposition', 'attachment; filename=' + content[0].Url + '.pdf');
        res.end(PdfFile);
   
});

module.exports = router;

