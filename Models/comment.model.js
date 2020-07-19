const db = require('../utils/db');
const TBL_COMMENTS = 'comments';

module.exports = {
    all: function () {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY t.Name)) as 'Stt', t.* from ${TBL_COMMENTS} t where IsDelete = 0`);
    },
    single: function (id) {
        return db.load(`SELECT * FROM ${TBL_COMMENTS} WHERE Id = ${id} and IsDelete = 0`);
    },
    commentByIdPost: function (IdPost) {
        return db.load(`SELECT c.Content, i.Nickname, c.DatetimeComment, i.Avatar FROM ${TBL_COMMENTS} c, information i 
                        WHERE c.IdAccount = i.IdAccount AND c.IdPost = '${IdPost}' AND c.IsDelete = 0`);
    },
    add: function (entity) {
        return db.add(TBL_ACCOUNTS, entity);
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
    }
};