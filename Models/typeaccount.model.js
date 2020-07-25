const db = require('../utils/db');
const TBL_TYPEACCOUNT = 'typeaccount';

module.exports = {
    all: function () {
        return db.load(`select Id, Name from ${TBL_TYPEACCOUNT} where IsDelete = 0`);
    },
    patch: function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_TAGS, entity, condition);
    },
    Provision: function (id) {
        const condition = {
          Id: id
        }
        return db.del_provisional(TBL_TAGS, condition);
    },
    activate: function (id) {
        const condition = {
          Id: id
        }
        return db.activate(TBL_TAGS, condition);
    }
};