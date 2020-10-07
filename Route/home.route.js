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
const { getTimeBetweenDate } = require('../js/betweendate');
const { getTime_Minutes } = require('../js/betweendate');
const { addMinutes } = require('../config/default.json');
const accountModel = require('../models/account.model');
const router = express.Router();
const Handlebars = require('express-handlebars');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { LoadAccount } = require('../models/account.model');
let upload = multer();
const printPdf = async (htmlPage) => {
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

function getComment(check, array, tmp, parent)
{
    parent.list = [];
    parent.count = 0;
    parent.index = Date.now() + parent.Id;
    check[parent.Id] = (check[parent.Id] || 0) + 1;
    for(let i = 0; i < tmp.length; i++)
    { 
      if(tmp[i].recipient_id === parent.Id)
      {
          tmp[i].list = [];
          tmp[i].index = Date.now() + tmp[i].Id;
          parent.count = parent.count + 1;
          parent.list.push(tmp[i]);
          getComment(check, tmp[i].list, tmp, tmp[i]);
      }
    }
    return parent;
}

function loadComment(listComment, check, url)
{
    for (const [key, value] of Object.entries(check)) {
        if(value !== 1)
        {
          const index = listComment.findIndex(element => element.Id+'' === key);
          listComment.splice(index, 1);
        }
    }

    return listComment;
}

// function buildComment(listComment, level, post) {
//     if (!level) {
//         level = 1;
//     }

//     let dateTimeFromNow = moment(listComment.DatetimeComment).startOf('hour').fromNow();
//     let arrayDate = dateTimeFromNow.split(' ');
//     let dateTimeComment;
//     if (arrayDate[1] !== 'giờ') {
//         dateTimeComment = moment(listComment.DatetimeComment, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss DD-MM-YYYY');
//     }
//     else {
//         dateTimeComment = dateTimeFromNow;
//     }
//     listComment.DatetimeComment = dateTimeComment;

//     let str = "";

//     console.log(listComment);

//     const template = fs.readFileSync(path.join(__dirname, '../templates/Comment.hbs'), "utf8");
//       const temp = Handlebars.precompile(template);
//       const precompiled = (new Function('return' + temp)());
//       str += Handlebars.template(precompiled)({ Comment:listComment, level:level, level2:level !== 3, Post:post });
//     if ((level === 1 && listComment.list.length !== 0) || (level === 2 && listComment.list.length !== 0)) {
//         str += `<a class="view-all-reply" data-toggle="collapse" href="#collapse${listComment.index}" role="button" aria-expanded="false" aria-controls="#collapse${listComment.index}">
//           <i class="fa fa-chevron-circle-down" aria-hidden="true"></i>
//           <span>more reply</span>
//         </a>
//         <div class="collapse media-content ml-5 pl-2" id="collapse${listComment.index}"> <div class="vetical"></div>`;
//     }


//     listComment.list.forEach((o) => {
//         str += buildComment(o, level + 1, post);
//     });

//     if ((level === 1 && listComment.list.length !== 0) || (level === 2 && listComment.list.length !== 0)) {
//         str += '</div>';
//     }

//     return new Handlebars.SafeString(str);
// }


// function complete text
function completeTextTitle(listPost, endTitle) {
    var tmpTitle = listPost[i].Title;
    listPost[i].Title = listPost[i].Title.substring(0, endTitle);
    for (k = endTitle; k < endTitle + 10; k++) {
        if (tmpTitle.charAt(k) != ' ') {
            listPost[i].Title = listPost[i].Title + tmpTitle.charAt(k);
        }
        else {
            break;
        }
    }
    listPost[i].Title = listPost[i].Title + "...";
}
// function complete summary
function completeTextSummary(listPost, end) {
    var tmpSummary = listPost[i].Content_Summary;
    listPost[i].Content_Summary = listPost[i].Content_Summary.substring(0, end);
    for (k = end; k < end + 5; k++) {
        if (tmpSummary.charAt(k) != ' ') {
            listPost[i].Content_Summary = listPost[i].Content_Summary + tmpSummary.charAt(k);
        }
        else {
            break;
        }
    }
    listPost[i].Content_Summary = listPost[i].Content_Summary + "...";
}
// function shorten of post
function shortenText(listPost, end, endTitle) {
    for (i = 0; i < listPost.length; i++) {
        if (listPost[i].Content_Summary.length > end) {
            completeTextSummary(listPost, end);
        }
    }

    for (i = 1; i < listPost.length; i++) {
        if (listPost[i].Title.length > endTitle) {
            completeTextTitle(listPost, endTitle);
        }
    }
}
// function shorten title
function shortenTitle(listPost, end) {
    for (i = 0; i < listPost.length; i++) {
        if (listPost[i].Title.length > end) {
            completeTextTitle(listPost, end);
        }
    }
}



// Trang index
router.get('/', async function (req, res) {

    let IsLogin = false;
    let IsAccountPremium = true;
    if (!req.session.isAuthenticated) {
        IsLogin = false;
        IsAccountPremium = false;
    }
    else {
        IsLogin = true;
        const dt_now = moment().format('YYYY-MM-DD HH:mm:ss');
        let dateEx;
        if ((!req.session.authAccount.DateExpired || isNaN(Date.parse(req.session.authAccount.DateExpired)))
            && res.locals.lcAuthUser.TypeAccount === 1)
        {
            IsAccountPremium = false;
            dateEx = moment(req.session.authAccount.DateExpired, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        }

        if (dateEx <= dt_now && res.locals.lcAuthUser.TypeAccount === 1)
        {
            IsAccountPremium = false;
        } 
    }


    // // danh sách bài viet moi nhat
    const listPostNew = await postModel.postnew();
    var listTreding = [];
    var numTrend = 0;
    var checkTrend = 0;
    if (listPostNew.length >= 4) {
        do {
            numTrend = numTrend + config.dayTrend;
            listTreding = await postModel.trending(numTrend);
            checkTrend = checkTrend + 1;
        }
        while (listTreding.length < 4 || checkTrend >= 4); // chay 12 tuan neu khong ra thi dung 
    }
    else // bai viet khong du thi chay 1 luot
    {
        numTrend = numTrend + config.dayTrend;
        listTreding = await postModel.trending(numTrend);
    }

    const listMostView = await postModel.mostview();

    const listCatPostNew = await postModel.categorypostnew();
    const listTag = await tagModel.listTagHome();

    const listRandomSidebar = await postModel.postRandomSideBar();
    const listFutureEvent = await postModel.furuteEvents();
    const listSliderPost = await postModel.SliderPost();


    // shorten context summary, title
    const end_Cotent_Summary = 110;
    const end_Title = 65;
    shortenText(listTreding, end_Cotent_Summary, end_Title);
    shortenText(listMostView, end_Cotent_Summary, end_Title);
    shortenText(listPostNew, end_Cotent_Summary, end_Title);
    shortenText(listCatPostNew, end_Cotent_Summary, end_Title);


    // shorten sliderPost, randomPost, futureEvent
    const end_Slider = 60;
    const end_Random = 20;
    const end_FutureEvent = 35;
    // slider
    shortenTitle(listSliderPost, end_Slider);
    // random
    shortenTitle(listRandomSidebar, end_Random);
    // futureEvent
    shortenTitle(listFutureEvent, end_FutureEvent);

    for (let i = 0; i < listTreding.length; i++) {
        listTreding[i].DatetimePost = moment(listTreding[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for (let i = 0; i < listMostView.length; i++) {
        listMostView[i].DatetimePost = moment(listMostView[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for (let i = 0; i < listPostNew.length; i++) {
        listPostNew[i].DatetimePost = moment(listPostNew[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for (let i = 0; i < listCatPostNew.length; i++) {
        listCatPostNew[i].DatetimePost = moment(listCatPostNew[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for (let i = 0; i < listRandomSidebar.length; i++) {
        listRandomSidebar[i].DatetimePost = moment(listRandomSidebar[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    for (let i = 0; i < listFutureEvent.length; i++) {
        listFutureEvent[i].DatetimePost = moment(listFutureEvent[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    // // khởi tạo biến premium chưa được đăng kí
     var premium = false;
    // // Khởi tạo isSubscriber là tài khoản độc giả
    var isSubscriber = true;

    // // Kiểm tra đăng nhập
    if (res.locals.lcIsAuthenticated === true) {
        // Kiểm tra tài khoản là độc giả
        if (res.locals.lcAuthUser.TypeAccount === 1) {
            isSubscriber = true;
            const user = res.locals.lcAuthUser.Username;

            const list = await accountModel.singUsername_Expired(user);
            const account = list[0];
            delete account.Password_hash;


            // Tính thời hạn đăng kí premium

            if (account.DateExpired) {
                const authU = res.locals.lcAuthUser;
                const dt_exp = new Date(moment(account.DateExpired, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
                const dt_now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));

                premium = getTimeBetweenDate(dt_now, dt_exp);
            }
        }
        else {
            isSubscriber = false;
        }
    }




    // // console.log(listTreding);
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
            load_Post1: function (context, options) {
                return options.fn(context[0]);
            },
            load_Post2: function (context, options) {
                let ret = "";
                for (let i = 1; i < context.length; i++) {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            },
            loadListRandomSideBar_1: function (context, options) {
                let ret = "";
                for (let i = 0; i < 4; i++) {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_2: function (context, options) {
                let ret = "";
                for (let i = 4; i < 8; i++) {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_3: function (context, options) {
                let ret = "";
                for (let i = 8; i < 12; i++) {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            },
            convertMonth: function (value) {
                if (value == 1) return "Jan";
                else if (value == 2) return "Feb";
                else if (value == 3) return "Mar";
                else if (value == 4) return "Apr";
                else if (value == 5) return "May";
                else if (value == 6) return "Jun";
                else if (value == 7) return "Jul";
                else if (value == 8) return "Aug";
                else if (value == 9) return "Sep";
                else if (value == 10) return "Oct";
                else if (value == 11) return "Nov";
                else if (value == 12) return "Dec";
                else return "?";
            },
        }

     });
    //res.send('Hello');
})

router.get('/premium/register', restrict, async function (req, res) {
    if (res.locals.lcAuthUser.TypeAccount !== 1) {
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
    if (account.DateExpired) {
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

router.post('/premium/register', restrict, async function (req, res) {
    const username = req.body.Username;
    const list = await accountModel.singUsername_Expired(username);
    if (list.length === 0) {
        return res.redirect('/');
    }
    const user = list[0];

    if (user.DateExpired) {
        const dt_exp = new Date(moment(user.DateExpired, 'YYYY/MM/DD HH:mm:ss'));
        const dt_now = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
        user.premium = getTimeBetweenDate(dt_now, dt_exp);
    }

    var date_expired = moment().add(req.body.Time, 'm').format('YYYY:MM:DD H:mm:ss');

    if (user.premium) {
        if (!user.premium.Notvalue) {
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

router.get('/detail/:Url', async function (req, res) {

    const url = req.params.Url;

    const posts_cmt = await postModel.single_url_posts(url);
    if (posts_cmt.length === 0) {
        req.flash('error', 'Bài viết không tồn tại.');
        return res.redirect('/');
    }

    if (posts_cmt[0].IdStatus !== 2) {
        req.flash('error', 'Bài viết chưa được xuất bản.');
        return res.redirect('/');
    }


    const retURL = `/detail/${url}`;
    if (posts_cmt[0].IsPremium === 1) {
        if (!req.session.isAuthenticated) {
            return res.redirect(`/account/login?retUrl=${retURL}`)
        }
        else {
            const username = req.session.authAccount.Username;
            const list = await accountModel.singUsername_Expired(username);
            if (list.length === 0) {
                return res.redirect('/');
            }
            const user = list[0];
            const dt_now = moment().format('YYYY-MM-DD HH:mm:ss');
            if (!user.DateExpired && user.TypeAccount === 1) {
                
                return res.redirect(`/premium/register?retUrl=${retURL}`);
            }
            const dateEx = moment(user.DateExpired, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

            if (dateEx <= dt_now && user.TypeAccount === 1) {
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

    for (let i = 0; i < postRandom.length; i++) {
        postRandom[i].DatetimePost = moment(postRandom[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }
    for (let i = 0; i < listRandomSidebar.length; i++) {
        listRandomSidebar[i].DatetimePost = moment(listRandomSidebar[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    for (let i = 0; i < listFutureEvent.length; i++) {
        listFutureEvent[i].DatetimePost = moment(listFutureEvent[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    post.DatetimePost = moment(post.DatetimePost, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');


    // shorten randomPost, futureEvent
    const end_Random = 20;
    const end_FutureEvent = 35;

    // random sidebar
    shortenTitle(listRandomSidebar, end_Random);
    // futureEvent
    shortenTitle(listFutureEvent, end_FutureEvent);
    // shorten context summary, title related articles
    const end_Cotent_Summary = 110;
    const end_Title = 65;
    shortenText(postRandom, end_Cotent_Summary, end_Title);

    // Bình luận bài viét
    const offset = (+req.body.number || 0) * config.pagination.limit;

    const pcmt = posts_cmt[0];
    const listComment = await commentModel.commentByIdPost_admin(pcmt.Id);

    let temparray = [];
    let check = {};

    for(let i = 0; i < listComment.length; i++)
    {
        temparray.push(getComment(check, temparray, listComment, listComment[i]));
    }

    let temp = loadComment(temparray, check, url);

    const empty = await commentModel.countCommentByIdPost_admin(pcmt.Id);

    let IsLogin = false;
    let IsAccountPremium = true;

    if (!req.session.isAuthenticated) {
        IsLogin = false;
        IsAccountPremium = false;
    }
    else {
        IsLogin = true;

        const dt_now = moment().format('YYYY-MM-DD HH:mm:ss');
        if (!req.session.authAccount.DateExpired && res.locals.lcAuthUser.TypeAccount === 1) {
            // console.log(2);
            IsAccountPremium = false;
        }
        const dateEx = moment(req.session.authAccount.DateExpired, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

        if (dateEx <= dt_now && res.locals.lcAuthUser.TypeAccount === 1) {
            //console.log(3);
            IsAccountPremium = false;
        }
    }

    const entityPost = {
        Id: post.Id,
        Views: post.Views + 1
    }

    await postModel.patch(entityPost);

    res.render('vwPost/detailPost', {
        layout: 'detailpost',
        post,
        listTag,
        postRandom,
        // listComment,
        // countComment,
        listComment: temp,
        empty: empty[0].Count,
        more: empty[0].Count > config.pagination.limit,
        tabComment:'active',


        emptyPostRandom: postRandom.length === 0,
        listPostTags,
        listRandomSidebar,
        listFutureEvent,
        IsLogin,
        IsAccountPremium,
        emptyFutureEvent: listFutureEvent.length === 0,
        helpers: {
            load_list_tags: function (context, Id, options) {
                let ret = "";
                let count = 0;
                for (let i = 0; i < context.length; i++) {
                    // //.log(context[i].Id);
                    // //.log(context[i]);
                    if (context[i].IdPost === Id && count < 3) {
                        ret = ret + options.fn(context[i]);
                        count++;
                    }
                }
                return ret;
            },
            loadListRandomSideBar_1: function (context, options) {
                let ret = "";
                for (let i = 0; i < 4; i++) {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_2: function (context, options) {
                let ret = "";
                for (let i = 4; i < 8; i++) {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_3: function (context, options) {
                let ret = "";
                for (let i = 8; i < 12; i++) {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            },
            convertMonth: function (value) {
                if (value == 1) return "Jan";
                else if (value == 2) return "Feb";
                else if (value == 3) return "Mar";
                else if (value == 4) return "Apr";
                else if (value == 5) return "May";
                else if (value == 6) return "Jun";
                else if (value == 7) return "Jul";
                else if (value == 8) return "Aug";
                else if (value == 9) return "Sep";
                else if (value == 10) return "Oct";
                else if (value == 11) return "Nov";
                else if (value == 12) return "Dec";
                else return "?";
            },

           
            
        }
    })
});

router.post('/post/comment/load', upload.fields([]), async function (req, res) {
    const url = req.body.Url || "empty";
    const idPost = +req.body.IdPost;
    const type = +req.body.Type === 1 ? 'c.DatetimeComment' : 'c.total_like';

    const posts = await postModel.single_url_posts(url);
    if (posts.length === 0) {
        req.flash('error', 'Bài viết không tồn tại.');
        return res.redirect('/admin/posts');
    }
    if (posts[0].IdStatus !== 2) {
        req.flash('error', 'Bài viết chưa được xuất bản.');
        return res.redirect('/admin/posts');
    }

    // const offset = (+req.body.Page || 1) * config.pagination.limit;

    const post = posts[0];
    const listComment = await commentModel.commentByIdPost_admin(post.Id, type);

    let temparray = [];
    let check = {};

    for(let i = 0; i < listComment.length; i++)
    {
        temparray.push(getComment(check, temparray, listComment, listComment[i]));
    }

    let temp = loadComment(temparray, check, url);

    // for (l of listComment) {
    //     l.DatetimeComment = moment(l.DatetimeComment, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss DD-MM-YYYY');
    //     l.Url = url;
    // }

    // const empty = await commentModel.countCommentByIdPost_admin(post.Id);
    // var more = true;
    // if (offset + config.pagination.limit >= empty[0].Count) {
    //     more = false;
    // }

    // const number = +req.body.number + 1;

    const data = {
        listComment: temp,
        post: post,
    }
    res.json(data);
})

router.post('/post/comment/add', upload.fields([]), async function (req, res) {
    
    const Url = req.body.Url;
    const IdComment = req.body.IdComment || null;

    if (!res.locals.lcIsAuthenticated) {
        const url = querystring.escape(`/detail/${Url}#cmt`);
        return res.json({Login:`/account/login?retUrl=${url}`});
    }
    // {"IdPost":"10","Url":"gioi-thieu-ve-iostream-cout-cin-va-endl-1596752895575","Content":""}
    const IdPost = req.body.IdPost;
    const Content = req.body.Content;
    const Name = res.locals.lcAuthUser.Name;
    if (!Content) {
        req.flash('error', 'Nội dung bình luận không thể để trống ');
        return res.json('IsEmpty');
    }

    const DatetimeComment = moment().format('YYYY-MM-DD HH:mm:ss');

    const entity = {
        IdPost,
        Content,
        recipient_id:IdComment,
        DatetimeComment,
        IsDelete: 0,
        IdAccount: res.locals.lcAuthUser.Id
    }
    const CommentInserted = await commentModel.add(entity);

    res.json({Content, DatetimeComment, Name, Id:CommentInserted.insertId, IdPost, Url});
})

router.post('/post/comment/like', async function (req, res) {
    
    const IdComment = +req.body.IdComment;
    let totalLike = +req.body.totalLike;
    const clicked = JSON.parse(req.body.Clicked);

    if(clicked === true)
    {
        totalLike -= 1;
    }
    else 
    {
        totalLike += 1;
    }

    if(req.body.length === 0)
    {
        res.json('fail');
    }
    const entity = {
        Id:IdComment,
        total_like:totalLike
    };
    const result = await commentModel.patch(entity);

    if(result.changedRows !== 0)
    {
        res.json({total_like: totalLike});
    }
});

router.get('/search', async function (req, res) {
    const ValueSearch = req.query.Search || '';
    const page = +req.query.page || 1;
    const offset = (page - 1) * config.pagination.limitPostPage;


    const [listPost, Total] = await Promise.all([postModel.LoadPostBySearch(config.pagination.limitPostPage, offset, ValueSearch), postModel.CountPostSearch(ValueSearch)]);
    const nPages = Math.ceil(Total[0].Number / config.pagination.limitPostPage);


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

    // shorten context summary, title
    const end_Cotent_Summary = 110;
    const end_Title = 65;
    shortenText(listPost, end_Cotent_Summary, end_Title);


    // shorten randomPost, futureEvent
    const end_Random = 20;
    const end_FutureEvent = 35;
    // random
    shortenTitle(listRandomSidebar, end_Random);
    // futureEvent
    shortenTitle(listFutureEvent, end_FutureEvent);

    for (let i = 0; i < listRandomSidebar.length; i++) {
        listRandomSidebar[i].DatetimePost = moment(listRandomSidebar[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }
    for (let i = 0; i < listFutureEvent.length; i++) {
        listFutureEvent[i].DatetimePost = moment(listFutureEvent[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM');
    }

    for (let i = 0; i < listPost.length; i++) {
        listPost[i].DatetimePost = moment(listPost[i].DatetimePost, 'DD/MM/YYYY').format('DD/MM/YYYY, HH:mm');
    }

    res.render('vwPost/search', {
        layout: 'listCategoryTag',
        listPost,
        emptyPost: listPost.length === 0,
        listPostTags,
        listRandomSidebar,
        listFutureEvent,
        helpers: {
            load_list_tags: function (context, Id, options) {
                let ret = "";
                let count = 0;
                for (let i = 0; i < context.length; i++) {

                    if (context[i].IdPost === Id && count < 3) {
                        ret = ret + options.fn(context[i]);
                        count++;
                    }
                }
                return ret;
            },
            loadListRandomSideBar_1: function (context, options) {
                let ret = "";
                for (let i = 0; i < 4; i++) {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_2: function (context, options) {
                let ret = "";
                for (let i = 4; i < 8; i++) {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            }
            ,
            loadListRandomSideBar_3: function (context, options) {
                let ret = "";
                for (let i = 8; i < 12; i++) {
                    ret = ret + options.fn(context[i]);
                }
                return ret;
            },
            convertMonth: function (value) {
                if (value == 1) return "Jan";
                else if (value == 2) return "Feb";
                else if (value == 3) return "Mar";
                else if (value == 4) return "Apr";
                else if (value == 5) return "May";
                else if (value == 6) return "Jun";
                else if (value == 7) return "Jul";
                else if (value == 8) return "Aug";
                else if (value == 9) return "Sep";
                else if (value == 10) return "Oct";
                else if (value == 11) return "Nov";
                else if (value == 12) return "Dec";
                else return "?";
            }
        },
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        last: nPages,
        SearchNotEmpty: ValueSearch.length !== 0,
        Search: querystring.escape(ValueSearch),
        SearchKey: ValueSearch,
    })
});


router.get('/ExportPdf/', async function (req, res) {
    const IdPost = +req.query.id;
    const content = await postModel.singleById(IdPost);
    const PdfFile = await printPdf(content[0].Content_Full);
    res.setHeader('Content-disposition', 'attachment; filename=' + content[0].Url + '.pdf');
    res.end(PdfFile);

});

module.exports = router;

