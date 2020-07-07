const db = require('../utils/db');
const TBL_POSTS = 'posts'

module.exports = {
    all: function () {
        return db.load(`select * from ${TBL_POSTS}`);
    },
    trending: function () {
        return db.load(`select p.Id, p.Title, i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost 
                        from posts p, accounts a, information i, postdetails pt 
                        where a.Id = i.IdAccount AND p.Id = pt.IdPost 
                        AND pt.IdAccount = a.Id AND p.DatetimePost <= NOW() 
                        ORDER BY p.Views DESC LIMIT 4`);
    },
    mostview: function () {
        return db.load(`select p.Id, p.Title, i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost 
                        from posts p, accounts a, information i, postdetails pt 
                        where a.Id = i.IdAccount AND p.Id = pt.IdPost 
                        AND pt.IdAccount = a.Id AND p.DatetimePost <= NOW() 
                        ORDER BY p.Views DESC LIMIT 10`);
    },
    postnew: function () {
        return db.load(`select p.Id, p.Title, i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost 
                        from posts p, accounts a, information i, postdetails pt 
                        where a.Id = i.IdAccount AND p.Id = pt.IdPost 
                        AND pt.IdAccount = a.Id AND p.DatetimePost <= NOW() 
                        ORDER BY p.DatetimePost DESC LIMIT 10`);
    },
    categorypostnew: function () {
        return db.load(`select p.Id, p.Title, i.Nickname, p.Content_Summary, p.Avatar, p.DatetimePost 
                        from posts p, accounts a, information i, postdetails pt 
                        where a.Id = i.IdAccount AND p.Id = pt.IdPost 
                        AND pt.IdAccount = a.Id AND p.DatetimePost <= NOW() 
                        ORDER BY p.DatetimePost DESC LIMIT 10`);
    },
    postByCategories: function (id) {
        return db.load(`SELECT * FROM ${TBL_POSTS} WHERE IdCategories = '${id}'`);
    },
    postByTag: function (id) {
        return db.load(`SELECT * FROM ${TBL_POSTS} WHERE IdTag = '${id}'`);
    },
    single: function (id) {
        return db.load(`SELECT * FROM ${TBL_POSTS} WHERE Id = '${id}'`);
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