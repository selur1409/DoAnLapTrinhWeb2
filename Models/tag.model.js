const db = require('../utils/db');
const TBL_TAGS = 'tags'

module.exports = {
    all: function () {
        return db.load(`select * from ${TBL_TAGS}`);
    },
    single: function (id) {
        return db.load(`SELECT * FROM ${TBL_TAGS} WHERE Id = '${id}'`);
    },
    add: function (entity) {
        return db.add(TBL_TAGS, entity);
    },
    patch: function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_TAGS, entity, condition);
    },
    del: function (id) {
        const condition = {
          Id: id
        }
        return db.del(TBL_TAGS, condition);
    }
};