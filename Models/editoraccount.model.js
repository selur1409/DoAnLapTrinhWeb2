const db = require('../utils/db');
const TBL_EDITORACCOUNT = 'editoraccount';

module.exports = {
    all: function () {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY t.Name)) as 'Stt', t.* from ${TBL_EDITORACCOUNT} t where IsDelete = 0`);
    },
    singleId: function (idCat) {
        return db.load(`SELECT Id FROM ${TBL_EDITORACCOUNT} WHERE IdCategories = ${idCat} and IsDelete = 0`);        
    },    
    singleManageCat: function (id) {
        return db.load(`SELECT i.IdAccount, i.Name FROM ${TBL_EDITORACCOUNT} e, information i WHERE e.IdAccount = i.IdAccount and e.IdCategories = ${id} and e.IsDelete = 0`);        
    },
    add: function (entity) {
        return db.add(TBL_EDITORACCOUNT, entity);
    },
    patch: function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_EDITORACCOUNT, entity, condition);
    },
    del: function (id) {
        const condition = {
          Id: id
        }
        return db.del(TBL_EDITORACCOUNT, condition);
    }
};