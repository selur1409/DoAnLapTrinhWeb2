const db = require('../utils/db');
const TBL_TAGS = 'tags';

module.exports = {
    all: function () {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY t.Name)) as 'Stt', t.* from ${TBL_TAGS} t where IsDelete = 0`);
    },
    single: function (id) {
        return db.load(`SELECT * FROM ${TBL_TAGS} WHERE Id = ${id} and IsDelete = 0`);
    },
    add: function (entity) {
        return db.add(TBL_ACCOUNTS, entity);
    },
    patch: function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_ACCOUNTS, entity, condition);
    },
    del: function (id) {
        const condition = {
          Id: id
        }
        return db.del(TBL_ACCOUNTS, condition);
    },
};