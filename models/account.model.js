const db = require('../utils/db');
const { use } = require('../route/account.route');

const TBL_ACCOUNTS = 'accounts'

module.exports = {
    all: function () {
        return db.load(`select * from ${TBL_ACCOUNTS}`);
    },
    singleId: function (username) {
        return db.load(`select Id from ${TBL_ACCOUNTS} where Username = '${username}'`);
    },

    add: function (entity) {
        return db.add(TBL_ACCOUNTS, entity);
    },
    addInfor: function(entity){
        db.add('information', entity);
        return 1;
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