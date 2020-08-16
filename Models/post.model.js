const db = require('../utils/db');
const TBL_POSTS = 'posts'
const TBL_POSTDETAILS = 'postdetails'

module.exports = {
    all: function () {
        return db.load(`select * from ${TBL_POSTS}`);
    },
    SliderPost: function () {
        return db.load(`select p.Id, p.Title, p.Url, p.Avatar, pd.IsPremium, cb.Name, cb.Url as 'CatURL', pd.IsPremium
                        from posts p, information i, postdetails pd, categories_sub cb 
                        where p.Id = pd.IdPost AND cb.Id = p.IdCategories AND pd.IdAccount = i.IdAccount
                        AND p.DatetimePost <= NOW() AND p.IsDelete = 0 AND p.IdStatus = 2
                        ORDER BY RAND() LIMIT 3`);
    },
    dislayList_lo: function (limit, offset) {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY p.DatetimePost DESC)) as 'Stt', p.*, 
                        s.Name as 'NameStatus', i.IdAccount, i.Name as 'NameWriter', cs.Name as 'NameCategory' 
                        from ${TBL_POSTS} p, status_posts s, postdetails pd, information i, categories_sub cs 
                        where p.IsDelete = 0 and s.Id = p.IdStatus
                        and p.Id = pd.IdPost and pd.IdAccount = i.IdAccount and cs.Id = p.IdCategories
                        limit ${limit} offset ${offset}`);
    },
    dislayList_activate: function (limit, offset) {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY p.DatetimePost DESC)) as 'Stt', p.*, 
                        s.Name as 'NameStatus', i.IdAccount, i.Name as 'NameWriter', cs.Name as 'NameCategory' 
        from ${TBL_POSTS} p, status_posts s, postdetails pd, information i, categories_sub cs 
        where p.IsDelete = 1 and s.Id = p.IdStatus
        and p.Id = pd.IdPost and pd.IdAccount = i.IdAccount and cs.Id = p.IdCategories
        limit ${limit} offset ${offset}`);
    },
    countDislayList: function () {
        return db.load(`select count(*) as 'SoLuong'
        from ${TBL_POSTS} p, status_posts s, postdetails pd, information i, categories_sub cs 
        where p.IsDelete = 0 and s.Id = p.IdStatus
        and p.Id = pd.IdPost and pd.IdAccount = i.IdAccount and cs.Id = p.IdCategories`);
    },
    countDislayList_activate: function () {
        return db.load(`select count(*) as 'SoLuong'
        from ${TBL_POSTS} p, status_posts s, postdetails pd, information i, categories_sub cs 
        where p.IsDelete = 1 and s.Id = p.IdStatus
        and p.Id = pd.IdPost and pd.IdAccount = i.IdAccount and cs.Id = p.IdCategories`);
    },
    dislayList_Status: function (idStatus, limit, offset) {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY p.DatetimePost DESC)) as 'Stt', p.*, 
        s.Name as 'NameStatus', i.IdAccount, i.Name as 'NameWriter', cs.Name as 'NameCategory' 
        from ${TBL_POSTS} p, status_posts s, postdetails pd, information i, categories_sub cs 
        where p.IdStatus = ${idStatus}
        and s.Id = p.IdStatus and p.IsDelete = 0
        and p.Id = pd.IdPost and pd.IdAccount = i.IdAccount and cs.Id = p.IdCategories
        limit ${limit} offset ${offset}`);
    },
    countDislayList_Status: function (idStatus) {
        return db.load(`select count(*) as 'SoLuong' 
        from ${TBL_POSTS} p, status_posts s, postdetails pd, information i, categories_sub cs 
        where p.IdStatus = ${idStatus}
        and s.Id = p.IdStatus and p.IsDelete = 0
        and p.Id = pd.IdPost and pd.IdAccount = i.IdAccount and cs.Id = p.IdCategories`);
    },
    countStatus: function(idStatus){
        if (idStatus !== 0)
            return db.load(`SELECT count(*) as 'Number' FROM ${TBL_POSTS} WHERE IdStatus = ${idStatus} AND IsDelete = 0`);
        return db.load(`SELECT count(*) as 'Number' FROM ${TBL_POSTS} WHERE IsDelete = 0`)   
    },
    trending: function (dayTrend) {
        return db.load(`select p.Id, p.Title, p.Url,i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost, pd.IsPremium, cb.Name, cb.Url as 'CatURL', p.Views
                        from ${TBL_POSTS} p, information i, postdetails pd, categories_sub cb 
                        where p.Id = pd.IdPost AND cb.Id = p.IdCategories AND pd.IdAccount = i.IdAccount
                        AND p.DatetimePost <= NOW() AND DATE_ADD(p.DatetimePost, INTERVAL ${dayTrend} DAY) >= NOW()  
                        AND p.IsDelete = 0 AND p.IdStatus = 2
                        ORDER BY p.Views DESC LIMIT 4`);
    },
    mostview: function () {
        return db.load(`select p.Id, p.Title, p.Url,i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost, pd.IsPremium, cb.Name, cb.Url as 'CatURL', p.Views
                        from ${TBL_POSTS} p, information i, postdetails pd, categories_sub cb 
                        where p.Id = pd.IdPost AND cb.Id = p.IdCategories AND pd.IdAccount = i.IdAccount
                        AND p.DatetimePost <= NOW() AND p.IsDelete = 0 AND p.IdStatus = 2
                        ORDER BY p.Views DESC LIMIT 10`);
    },
    postnew: function () {
        return db.load(`select p.Id, p.Title, p.Url,i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost, pd.IsPremium, cb.Name, cb.Url as 'CatURL', p.Views
                        from ${TBL_POSTS} p, information i, postdetails pd, categories_sub cb 
                        where p.Id = pd.IdPost AND cb.Id = p.IdCategories AND pd.IdAccount = i.IdAccount
                        AND p.DatetimePost <= NOW() AND p.IsDelete = 0 AND p.IdStatus = 2
                        ORDER BY p.DatetimePost DESC LIMIT 10`);
    },
    categorypostnew: function () {
        return db.load(`select p.Id, p.Title, p.Url,i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost, pd.IsPremium, cb.Name, cb.Url as 'CatURL', p.Views
                        from ${TBL_POSTS} p, information i, postdetails pd, categories_sub cb 
                        where p.Id = pd.IdPost AND cb.Id = p.IdCategories AND pd.IdAccount = i.IdAccount
                        AND p.DatetimePost <= NOW() AND p.IsDelete = 0 AND p.IdStatus = 2
                        GROUP BY p.IdCategories 
                        ORDER BY p.DatetimePost DESC LIMIT 10`);
    },
    postByCategories: function (id) {
        return db.load(`SELECT * FROM ${TBL_POSTS} WHERE IdCategories = ${id}`);
    },
    postRandomByCategories: function (idCat, idPost) {
                        return db.load(`select p.Id, p.Title, p.Url, i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost, pd.IsPremium, cb.Name, cb.Url as 'CatURL'   
                        from ${TBL_POSTS} p, information i, postdetails pd, categories_sub cb  
                        where p.Id = pd.IdPost AND cb.Id = p.IdCategories and pd.IdAccount = i.IdAccount
                        AND p.DatetimePost <= NOW() AND p.IsDelete = 0  AND p.IdStatus = 2 AND p.IdCategories = ${idCat} AND p.Id != ${idPost}
                        ORDER BY RAND() LIMIT 5`);
    },
    postRandomSideBar: function () {
                        return db.load(`SELECT p.Url, p.Title, p.Avatar, i.Nickname, p.DatetimePost, pd.IsPremium
                        FROM ${TBL_POSTS} p, postdetails pd, information i
                        WHERE p.Id = pd.IdPost AND pd.IdAccount = i.IdAccount AND p.DatetimePost <= NOW() AND p.IsDelete = 0  AND p.IdStatus = 2 
                        ORDER BY RAND() LIMIT 12`);
    },
    furuteEvents: function () {
                        return db.load(`SELECT p.Url, p.Title, p.Avatar, i.Nickname, p.DatetimePost, DAY(p.DatetimePost) 'dayEvent', MONTH(p.DatetimePost) 'monthEvent', pd.IsPremium
                        FROM ${TBL_POSTS} p, postdetails pd, information i
                        WHERE p.Id = pd.IdPost AND pd.IdAccount = i.IdAccount AND p.DatetimePost > NOW() AND p.IsDelete = 0  AND p.IdStatus = 1 
                        ORDER BY RAND() LIMIT 12`);
    },
    postTags: function () {
        return db.load(`SELECT p.Id AS 'IdPost', tp.Id as 'IdTagPosts', t.Name, t.TagName
                        FROM ${TBL_POSTS} p, tag_posts tp, tags t
                        WHERE p.Id = tp.IdPost AND tp.IdTag = t.Id`);
    },
    postByTag: function (Limit, Offset, tn) {
        return db.load(`select DISTINCT(p.Id), p.Title, p.Url, i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost, cb.Name, cb.Url as 'CatURL', pd.IsPremium, p.Views
                        from posts p, information i, postdetails pd, tag_posts tp, tags t, categories_sub cb
                        where p.Id = pd.IdPost AND tp.IdPost = p.Id AND t.Id = tp.IdTag AND cb.Id = p.IdCategories
                        AND pd.IdAccount = i.IdAccount AND p.DatetimePost <= NOW() AND cb.IsDelete = 0 AND p.IsDelete = 0 AND p.IdStatus = 2 AND t.TagName = '${tn}' 
                        ORDER BY pd.IsPremium DESC, p.DatetimePost DESC
                        LIMIT ${Limit} OFFSET ${Offset}
                        `);
    },
    CountPostByTag:(Value)=>{
        return db.load(`SELECT count(*) AS Number
                        FROM posts p, tag_posts tp, tags t
                        WHERE p.Id = tp.IdPost AND t.Id = tp.IdTag 
                        AND p.DatetimePost <= NOW() AND p.IsDelete = 0 AND t.IsDelete = 0 AND p.IdStatus = 2
                        AND t.TagName =  '${Value}'
                        `);
    },
    postByCategory: function (Limit, Offset, catURL) {
        return db.load(`SELECT DISTINCT(p.Id), p.Title, p.Url, i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost, cb.Name, cb.Url as 'CatURL', pd.IsPremium, p.Views
                        FROM categories_sub cb, posts p, information i, postdetails pd
                        WHERE cb.Id = p.IdCategories AND p.Id = pd.IdPost AND pd.IdAccount = i.IdAccount
                        AND p.DatetimePost <= NOW() AND p.IsDelete = 0 AND cb.IsDelete = 0 AND p.IdStatus = 2 AND cb.Url = '${catURL}'
                        ORDER BY pd.IsPremium DESC, p.DatetimePost DESC
                        LIMIT ${Limit} OFFSET ${Offset}
                        `);
    },
    CountPostByCategory:(Value)=>{
        return db.load(`SELECT Count(*) AS Number FROM categories_sub cb, posts p
                        WHERE cb.Id = p.IdCategories AND p.DatetimePost <= NOW() AND p.IsDelete = 0 AND cb.IsDelete = 0 AND p.IdStatus = 2
                        AND cb.Url =  '${Value}'
                        `);
    },
    single: function (url) {
        return db.load(`SELECT p.*, i.Nickname, i.Avatar AS 'AvatarWriter', i.IdAccount, pd.IsPremium, cb.Name, cb.Url AS 'CatURL'
                        FROM posts p, postdetails pd, information i, categories_sub cb
                        WHERE p.Id = pd.IdPost AND pd.IdAccount = i.IdAccount AND cb.Id = p.IdCategories
                        AND p.Url =  '${url}'`);
    },
    singleById: function (id) {
        return db.load(`SELECT p.*, i.Nickname, i.Avatar AS 'AvatarWriter', i.IdAccount
                        FROM posts p, postdetails pd, information i
                        WHERE p.Id = pd.IdPost AND pd.IdAccount = i.IdAccount
                        AND p.Id =  '${id}'`);
    },
    dislayList: function () {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY p.DatetimePost DESC)) as 'Stt', p.*, 
                        s.Name as 'NameStatus', i.IdAccount, i.Name as 'NameWriter', cs.Name as 'NameCategory' 
        from ${TBL_POSTS} p, status_posts s, postdetails pd, information i, categories_sub cs 
        where p.IsDelete = 0 and s.Id = p.IdStatus
        and p.Id = pd.IdPost and pd.IdAccount = i.IdAccount and cs.Id = p.IdCategories`);
    },
    single_url_posts: function (url) {
        return db.load(`SELECT p.*, s.Name as 'NameStatus', i.IdAccount, i.Nickname as 'NameWriter', cs.Name as 'NameCategory', pd.IsPremium
                        FROM posts p, status_posts s, postdetails pd, information i, categories_sub cs 
                        WHERE p.Url = '${url}' and p.IsDelete = 0 and s.Id = p.IdStatus
                        and p.Id = pd.IdPost and pd.IdAccount = i.IdAccount and cs.Id = p.IdCategories`);
    },
    single_url_posts_comment: function (url) {
        return db.load(`SELECT p.Id, p.Title, p.Url, p.IdStatus
                        FROM posts p
                        WHERE p.Url = '${url}' and p.IsDelete = 0`);
    },
    singleIdTag_idPost: function (idPost) {
        return db.load(`SELECT IdTag
                        FROM tag_posts
                        WHERE IdPost = ${idPost} `);
    },
    singlePremium_idPost: function (idPost) {
        return db.load(`SELECT IsPremium
                        FROM postdetails
                        WHERE IdPost = ${idPost}`);
    },
    detailsTags_idPost: function (idPost) {
        return db.load(`SELECT t.Id, t.TagName
                        FROM tag_posts tp, tags t
                        WHERE tp.IdPost = ${idPost} and tp.IdTag = t.Id`);
    },
    LoadPostBySearch:(Limit, Offset, Value)=>{
        return db.load(`SELECT p.Id, p.Url, p.Title, p.Content_Summary, p.Content_Full, p.DatePost, p.Avatar, p.Views, p.DatetimePost, p.IdCategories, p.IdStatus, inf.Nickname, cb.Name, cb.Url as 'CatURL', pd.IsPremium, p.Views
        FROM posts p, postdetails pd, information inf, categories_sub cb 
        WHERE MATCH(p.Title, p.Content_Summary, p.Content_Full) AGAINST ('${Value}' IN NATURAL LANGUAGE MODE) AND p.Id = pd.IdPost AND pd.IdAccount = inf.IdAccount AND p.IdCategories = cb.Id AND p.IdStatus = 2
        ORDER BY pd.IsPremium DESC, p.Views DESC
        LIMIT ${Limit} OFFSET ${Offset}`);
    },

    CountPostSearch:(Value)=>{
        return db.load(`SELECT Count(*) AS Number
        FROM posts p, postdetails pd, information inf
        WHERE MATCH(p.Title, p.Content_Summary, p.Content_Full) AGAINST ('${Value}' IN NATURAL LANGUAGE MODE) AND p.Id = pd.IdPost AND pd.IdAccount = inf.IdAccount AND p.IdStatus = 2`);
    },

    add: function (entity) {
        return db.add(TBL_POSTS, entity);
    },
    patch: function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_POSTS, entity, condition);
    },
    patchPostDetails: function (entity) {
        const condition = {
          IdPost: entity.IdPost
        }
        delete entity.IdPost;
        return db.patch(TBL_POSTDETAILS, entity, condition);
    },
    LoadFeedBackOfPosts:(idPost)=>
    {
        return db.load(`SELECT f.Id, f.Note, f.DatetimeApproval, i.Name as 'NameEditorAccount' 
        FROM feedback f, information i
        WHERE IdPost=${idPost} and f.IdEditorAccount = i.IdAccount
        AND IsDelete=0`);
    },
    provisionFeedback: function (id) {
        const condition = {
          IdPost: id
        }
        return db.del_provisional('feedback', condition);
    },
    provisionPost: function (id) {
        const condition = {
          Id: id
        }
        return db.del_provisional(TBL_POSTS, condition);
    },
    checkId: function(id){
        return db.load(`SELECT Url FROM ${TBL_POSTS} WHERE Id = ${id}`)
    },
    checkPost: function(url){
        return db.load(`SELECT Id FROM ${TBL_POSTS} WHERE IsDelete = 0 and Url = '${url}'`)
    },
    activatePost: function (id) {
        const condition = {
          Id: id
        }
        return db.activate(TBL_POSTS, condition);
    },
    del: function (id) {
        const condition = {
          Id: id
        }
        return db.del(TBL_POSTS, condition);
    }
};