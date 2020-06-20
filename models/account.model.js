const db = require('../utils/db');

const TBL_ACCOUNTS = 'accounts'

module.exports = {
    all: function () {
        return db.load(`select * from ${TBL_ACCOUNTS}`);
    },
    allUsername: function(){
        return db.load(`select username from ${TBL_ACCOUNTS}`)
    },
    single: function (id) {
        return db.load(`select * from ${TBL_ACCOUNTS} where Id = ${id}`);
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
          CatID: id
        }
        return db.del(TBL_ACCOUNTS, condition);
    }
};