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
    singleNameMain: async function (name) {
        const rows = await db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Name = '${name}'`);
        return rows[0];
    },
    singleUrlMain: async function (url) {
        const rows = await db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Url = '${url}'`);
        return rows[0];
    },
    singleNameMainEdit: async function (name, id) {
        const rows = await db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Name = '${name}' and Id != ${id}`);
        return rows[0];
    },
    singleUrlMainEdit: async function (url, id) {
        const rows = await db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Url = '${url}' and Id != ${id}`);
        return rows[0];
    },
    singleNameSub: async function (name) {
        const rows = await db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Name = '${name}'`);
        return rows[0];
    },
    singleUrlSub: async function (url) {
        const rows = await db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Url = '${url}'`);
        return rows[0];
    },
    singleNameSubEdit: async function (name, id) {
        const rows = await db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Name = '${name}' and Id != ${id}`);
        return rows[0];
    },
    singleUrlSubEdit: async function (url, id) {
        const rows = await db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Url = '${url}' and Id != ${id}`);
        return rows[0];
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
    patchIsDelMain: function (id) {
        const condition = {
          Id: id
        }
        const entity = {
            IsDelete: 1
        }
        return db.patch(TBL_CATEGORIES, entity, condition);
    },
    patchIsDelSub: function (id) {
        const condition = {
          Id: id
        }
        const entity = {
            IsDelete: 1
        }
        return db.patch(TBL_CATEGORIES_SUB, entity, condition);
    },
    delMain: function (id) {
        const condition = {
          Id: id
        }
        return db.del(TBL_CATEGORIES, condition);
    },
    delSub: function (id) {
        const condition = {
          Id: id
        }
        return db.del(TBL_CATEGORIES_SUB, condition);
    },
};