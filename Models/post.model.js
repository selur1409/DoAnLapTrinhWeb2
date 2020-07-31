const db = require('../utils/db');
const TBL_POSTS = 'posts'

module.exports = {
    all: function () {
        return db.load(`select * from ${TBL_POSTS}`);
    },
    dislayList: function () {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY p.DatetimePost DESC)) as 'Stt', p.*, 
                        s.Name as 'NameStatus', i.IdAccount, i.Name as 'NameWriter', cs.Name as 'NameCategory' 
        from ${TBL_POSTS} p, status_posts s, postdetails pd, information i, categories_sub cs 
        where p.IsDelete = 0 and s.Id = p.IdStatus
        and p.Id = pd.IdPost and pd.IdAccount = i.IdAccount and cs.Id = p.IdCategories`);
    },
    dislayList_Status: function (idStatus) {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY p.DatetimePost DESC)) as 'Stt', p.*, 
        s.Name as 'NameStatus', i.IdAccount, i.Name as 'NameWriter', cs.Name as 'NameCategory' 
        from ${TBL_POSTS} p, status_posts s, postdetails pd, information i, categories_sub cs 
        where p.IdStatus = ${idStatus}
        and s.Id = p.IdStatus and p.IsDelete = 0
        and p.Id = pd.IdPost and pd.IdAccount = i.IdAccount and cs.Id = p.IdCategories`);
    },
    countStatus: function(idStatus){
        if (idStatus !== 0)
            return db.load(`SELECT count(*) as 'Number' FROM ${TBL_POSTS} WHERE IdStatus = ${idStatus}`);
        return db.load(`SELECT count(*) as 'Number' FROM ${TBL_POSTS}`)   
    },
    trending: function () {
        return db.load(`select p.Id, p.Title, p.Url,i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost, pt.IsPremium 
                        from posts p, accounts a, information i, postdetails pt 
                        where a.Id = i.IdAccount AND p.Id = pt.IdPost 
                        AND pt.IdAccount = a.Id AND p.DatetimePost <= NOW() AND p.IsDelete = 0
                        ORDER BY p.Views DESC LIMIT 4`);
    },
    mostview: function () {
        return db.load(`select p.Id, p.Title, p.Url, i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost, pt.IsPremium  
                        from posts p, accounts a, information i, postdetails pt 
                        where a.Id = i.IdAccount AND p.Id = pt.IdPost 
                        AND pt.IdAccount = a.Id AND p.DatetimePost <= NOW() AND p.IsDelete = 0
                        ORDER BY p.Views DESC LIMIT 10`);
    },
    postnew: function () {
        return db.load(`select p.Id, p.Title, p.Url, i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost, pt.IsPremium  
                        from posts p, accounts a, information i, postdetails pt 
                        where a.Id = i.IdAccount AND p.Id = pt.IdPost 
                        AND pt.IdAccount = a.Id AND p.DatetimePost <= NOW() AND p.IsDelete = 0
                        ORDER BY p.DatetimePost DESC LIMIT 10`);
    },
    categorypostnew: function () {
        return db.load(`select p.Id, p.Title, p.Url, i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost, pt.IsPremium  
                        from posts p, accounts a, information i, postdetails pt 
                        where a.Id = i.IdAccount AND p.Id = pt.IdPost 
                        AND pt.IdAccount = a.Id AND p.DatetimePost <= NOW() AND p.IsDelete = 0
                        ORDER BY p.DatetimePost DESC LIMIT 10`);
    },
    postByCategories: function (id) {
        return db.load(`SELECT * FROM ${TBL_POSTS} WHERE IdCategories = ${id}`);
    },
    postRandomByCategories: function (idCat, idPost) {
        return db.load(`SELECT p.*, i.Nickname FROM posts p, information i, postdetails pd 
                        WHERE p.Id = pd.IdPost AND pd.IdAccount = i.IdAccount AND p.IdCategories = ${idCat} AND p.Id != ${idPost}
                        ORDER BY RAND() LIMIT 5`);
    },
    postByTag: function (tn) {
        return db.load(`select DISTINCT(p.Id), p.Title, p.Url, i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost
                        from posts p, accounts a, information i, postdetails pt, tag_posts tp, tags t 
                        where a.Id = i.IdAccount AND p.Id = pt.IdPost AND tp.IdPost = p.Id AND t.Id = tp.IdTag 
                        AND pt.IdAccount = a.Id AND p.DatetimePost <= NOW() AND p.IsDelete = 0 AND t.TagName = '${tn}' 
                        ORDER BY p.DatetimePost DESC`);
    },
    single: function (url) {
        return db.load(`SELECT p.*, i.Nickname, i.Avatar AS 'AvatarWriter', i.IdAccount
                        FROM posts p, postdetails pd, information i
                        WHERE p.Id = pd.IdPost AND pd.IdAccount = i.IdAccount
                        AND p.Url =  '${url}'`);
    },
    dislayList: function () {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY p.DatetimePost DESC)) as 'Stt', p.*, 
                        s.Name as 'NameStatus', i.IdAccount, i.Name as 'NameWriter', cs.Name as 'NameCategory' 
        from ${TBL_POSTS} p, status_posts s, postdetails pd, information i, categories_sub cs 
        where p.IsDelete = 0 and s.Id = p.IdStatus
        and p.Id = pd.IdPost and pd.IdAccount = i.IdAccount and cs.Id = p.IdCategories`);
    },
    single_url_posts: function (url) {
        return db.load(`SELECT p.*, s.Name as 'NameStatus', i.IdAccount, i.Name as 'NameWriter', cs.Name as 'NameCategory'
                        FROM posts p, status_posts s, postdetails pd, information i, categories_sub cs 
                        WHERE p.Url = '${url}' and p.IsDelete = 0 and s.Id = p.IdStatus
                        and p.Id = pd.IdPost and pd.IdAccount = i.IdAccount and cs.Id = p.IdCategories`);
    },
    singleIdTag_idPost: function (idPost) {
        return db.load(`SELECT IdTag
                        FROM tag_posts
                        WHERE IdPost = ${idPost} `);
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
    del: function (id) {
        const condition = {
          Id: id
        }
        return db.del(TBL_POSTS, condition);
    }
};