const db = require('../utils/db');
const TBL_CATEGORIES = 'categories'
const TBL_CATEGORIES_SUB = 'categories_sub'

module.exports = {
    all: function () {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY t.Name)) as 'Stt', t.Id, t.Name, t.Url, t.Description 
                        from (SELECT Id, Name, Url, Description FROM ${TBL_CATEGORIES_SUB} WHERE IsDelete = 0 
                        UNION 
                        SELECT Id, Name, Url, Description FROM ${TBL_CATEGORIES} WHERE IsDelete = 0) as t ORDER BY t.Name`);
    },
    allMain: function () {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY Name)) as 'Stt', Id, Name, Url, Description FROM ${TBL_CATEGORIES} WHERE IsDelete = 0 ORDER BY Name`);
    },
    allSub: function () {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY Name)) as 'Stt', Id, Name, Url, Description FROM ${TBL_CATEGORIES_SUB} WHERE IsDelete = 0 ORDER BY Name`);
    },
    single: function (username) {
        return db.load(`SELECT a.Id, a.Username, a.Password_hash, a.TypeAccount, i.Name, i.Nickname, i.Avatar 
                        FROM ${TBL_CATEGORIES} a, information i 
                        WHERE a.Id = i.IdAccount and a.IsDelete = 0 and Username = '${username}'`);
    },
    add: function (entity) {
        return db.add(TBL_CATEGORIES, entity);
    },
    patch: function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_CATEGORIES, entity, condition);
    },
    del: function (id) {
        const condition = {
          Id: id
        }
        return db.del(TBL_CATEGORIES, condition);
    },
};