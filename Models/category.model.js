const db = require('../utils/db');
const TBL_CATEGORIES = 'categories';
const TBL_CATEGORIES_SUB = 'categories_sub';

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
    allSub_Id: function (id) {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY Name)) as 'Stt', Id, Name, Url, Description FROM ${TBL_CATEGORIES_SUB} WHERE IsDelete = 0 AND IdCategoriesMain = ${id} ORDER BY Name`);
    },
    
    getNameMain: function(id){
        return db.load(`SELECT c.Name FROM ${TBL_CATEGORIES_SUB} s, ${TBL_CATEGORIES} c WHERE s.Id = ${id} and s.IdCategoriesMain = c.Id`);
        
    },
    singleNameMain: function (name) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Name = '${name}'`);
    },
    singleUrlMain: function (url) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Url = '${url}'`);
    },
    singleNameMainEdit: function (name, id) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Name = '${name}' and Id != ${id}`); 
    },
    singleUrlMainEdit: function (url, id) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Url = '${url}' and Id != ${id}`);
    },
    singleNameSub: function (name) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Name = '${name}'`);
    },
    singleUrlSub: async function (url) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Url = '${url}'`);
    },
    singleNameSubEdit: async function (name, id) {
        return await db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Name = '${name}' and Id != ${id}`);
    },
    singleUrlSubEdit: function (url, id) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Url = '${url}' and Id != ${id}`);
    },
    addMain: function (entity) {
        return db.add(TBL_CATEGORIES, entity);
    },
    addSub: function (entity) {
        return db.add(TBL_CATEGORIES_SUB, entity);
    },
    patchMain: function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_CATEGORIES, entity, condition);
    },
    patchSub: function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_CATEGORIES_SUB, entity, condition);
    },

    delMain: function (id) {
        const condition = {
          Id: id
        }
        return db.del_provisional(TBL_CATEGORIES, condition);
    },
    delSub: function (id) {
        const condition = {
          Id: id
        }
        return db.del_provisionall(TBL_CATEGORIES_SUB, condition);
    },
    provisionalMain: function (id) {
        const condition = {
          Id: id
        }
        return db.activated(TBL_CATEGORIES, condition);
    },
    provisionalSub: function (id) {
        const condition = {
          Id: id
        }
        return db.activated(TBL_CATEGORIES_SUB, condition);
    },
};