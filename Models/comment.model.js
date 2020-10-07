const db = require('../utils/db');
const TBL_COMMENTS = 'comments';

module.exports = {
    all: function () {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY t.Name)) as 'Stt', t.* from ${TBL_COMMENTS} t where IsDelete = 0`);
    },
    allComment: function () {
        return db.load(`select t.* from ${TBL_COMMENTS} t where IsDelete = 0`);
    },
    single: function (id) {
        return db.load(`SELECT * FROM ${TBL_COMMENTS} WHERE Id = ${id} and IsDelete = 0`);
    },
    commentByIdPost: function (IdPost) {
        return db.load(`SELECT c.Content, c.Id, i.Nickname, c.DatetimeComment, i.Avatar FROM ${TBL_COMMENTS} c, information i 
                        WHERE c.IdAccount = i.IdAccount AND c.IdPost = ${IdPost} AND c.IsDelete = 0`);
    },

    commentByIdComment:function(IdPost, IdComment) {
        return db.load(`SELECT c.Content, c.Id, i.Nickname, c.DatetimeComment, i.Avatar FROM ${TBL_COMMENTS} c, information i 
        WHERE c.IdAccount = i.IdAccount AND c.IdPost = ${IdPost} AND c.recipient_id = ${IdComment} AND c.IsDelete = 0`);
    },

    countCommentByIdPost_admin: function (IdPost) {
        return db.load(`SELECT count(c.Id) as 'Count'
                        FROM ${TBL_COMMENTS} c
                        WHERE c.IdPost = ${IdPost} AND c.IsDelete = 0`);
    },
    countCommentByIdPost_admin_NotCheck: function (IdPost) {
        return db.load(`SELECT count(c.Id) as 'Count'
                        FROM ${TBL_COMMENTS} c
                        WHERE c.IdPost = ${IdPost} AND c.IsCheck = 0 AND c.IsDelete = 0`);
    },
    commentByIdPost_admin: function (IdPost, type = 'c.DatetimeComment') {
        return db.load(`SELECT c.Id, c.recipient_id, c.Content, c.DatetimeComment, c.total_like, c.IsCheck, i.Avatar, i.IdAccount, i.Name
                        FROM ${TBL_COMMENTS} c, information i 
                        WHERE c.IdAccount = i.IdAccount AND c.IdPost = ${IdPost} AND c.IsDelete = 0
                        ORDER BY c.IsCheck ASC, ${type} DESC`);
    },

    add: function (entity) {
        return db.add(TBL_COMMENTS, entity);
    },
    patch: function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_COMMENTS, entity, condition);
    },
    del: function (id) {
        const condition = {
          Id: id
        }
        return db.del(TBL_COMMENTS, condition);
    },
    provision: function (id) {
        const condition = {
          Id: id
        }
        return db.del_provisional(TBL_COMMENTS, condition);
    }
};