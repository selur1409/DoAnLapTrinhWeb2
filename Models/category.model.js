const db = require('../utils/db');
const TBL_CATEGORIES = 'categories';
const TBL_CATEGORIES_SUB = 'categories_sub';
const TBL_EDITORACCOUNT = 'editoraccount';
const TBL_INFORMATION = 'information';

module.exports = {
    all: function (limit, offset) {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY t.Name)) as 'Stt', t.Id, t.Name, t.Url, t.Description 
                        from (SELECT Id, Name, Url, Description FROM ${TBL_CATEGORIES_SUB} WHERE IsDelete = 0 
                        UNION 
                        SELECT Id, Name, Url, Description FROM ${TBL_CATEGORIES} 
                        WHERE IsDelete = 0) as t ORDER BY t.Name
                        limit ${limit} offset ${offset}`);
    },
    allMain: function () {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY Name)) as 'Stt', Id, Name, Url, Description 
        FROM ${TBL_CATEGORIES} 
        WHERE IsDelete = 0 ORDER BY Name`);
    },
    allSubCategory: function () {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY Name)) as 'Stt', Id, Name, Url, Description 
        FROM ${TBL_CATEGORIES_SUB} 
        WHERE IsDelete = 0 ORDER BY Name`);
    },
    allMain_EditorManage: function (id) {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY Name)) as 'Stt', c.Id, c.Name, c.Url, i.Name as 'Manage', a.Username
        FROM ${TBL_CATEGORIES} c, ${TBL_EDITORACCOUNT} e, ${TBL_INFORMATION} i, accounts a
        WHERE e.IdAccount = ${id} and e.IdCategories = c.Id and i.IdAccount = e.IdAccount and i.IdAccount = a.Id
        and e.IsDelete = 0 and c.IsDelete = 0 ORDER BY Name`);
    },
    allMain_NotManage: function (id) {
        return db.load(`SELECT Id, Name, Url FROM ${TBL_CATEGORIES} WHERE Id NOT IN (SELECT IdCategories FROM ${TBL_EDITORACCOUNT})`);
    },
    allMain_EditorManageCategories: function (id) {
        return db.load(`SELECT c.Id, c.Name, c.Url
        FROM ${TBL_CATEGORIES} c, ${TBL_EDITORACCOUNT} e
        WHERE e.IdAccount = ${id} and e.IdCategories = c.Id
        and c.IsDelete = 0`);
    },
    allMainId_EditorManageCategories: function (id) {
        return db.load(`SELECT c.Id
        FROM ${TBL_CATEGORIES} c, ${TBL_EDITORACCOUNT} e
        WHERE e.IdAccount = ${id} and e.IdCategories = c.Id
        and e.IsDelete = 0`);
    },
    allCategories_NoEditorManage: function () {
        return db.load(`SELECT c.Id, c.Name, c.Url FROM ${TBL_CATEGORIES} c WHERE c.Id NOT IN (SELECT e.IdCategories FROM ${TBL_EDITORACCOUNT} e)`);
    },
    allMain_Limit: function (limit, offset) {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY Name)) as 'Stt', Id, Name, Url, Description 
        FROM ${TBL_CATEGORIES} 
        WHERE IsDelete = 0 ORDER BY Name
        limit ${limit} offset ${offset}`);
    },
    countAll: function () {
        return db.load(`SELECT count(*) as SoLuong
                        from (SELECT Id, Name, Url, Description FROM ${TBL_CATEGORIES_SUB} WHERE IsDelete = 0 
                        UNION 
                        SELECT Id, Name, Url, Description FROM ${TBL_CATEGORIES} 
                        WHERE IsDelete = 0) as t ORDER BY t.Name`);
    },
    countAllMain: function () {
        return db.load(`SELECT count(*) as 'SoLuong' FROM ${TBL_CATEGORIES} WHERE IsDelete = 0`);
    },
    allMainProvisional: function (limit, offset) {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY Name)) as 'Stt', Id, Name, Url, Description 
        FROM ${TBL_CATEGORIES} 
        WHERE IsDelete = 1 ORDER BY Name
        limit ${limit} offset ${offset}`);
    },
    countAllMainProvisional: function () {
        return db.load(`SELECT count(*) as 'SoLuong' 
        FROM ${TBL_CATEGORIES} 
        WHERE IsDelete = 1 ORDER BY Name`);
    },
    allSub: function () {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY Name)) as 'Stt', Id, Name, Url, Description FROM ${TBL_CATEGORIES_SUB} WHERE IsDelete = 0 ORDER BY Name`);
    },
    allSub_Id: function (id) {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY Name)) as 'Stt', Id, Name, Url, Description 
        FROM ${TBL_CATEGORIES_SUB} 
        WHERE IsDelete = 0 AND IdCategoriesMain = ${id} ORDER BY Name`);
    },
    allSub_Id_Limit: function (id, limit, offset) {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY Name)) as 'Stt', Id, Name, Url, Description 
        FROM ${TBL_CATEGORIES_SUB} 
        WHERE IsDelete = 0 AND IdCategoriesMain = ${id} ORDER BY Name
        limit ${limit} offset ${offset}`);
    },
    countAllSub_Id: function (id) {
        return db.load(`SELECT count(*) as 'SoLuong'
        FROM ${TBL_CATEGORIES_SUB} 
        WHERE IsDelete = 0 AND IdCategoriesMain = ${id} ORDER BY Name`);
    },
    allSub_Id_Provisional: function (id, limit, offset) {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY Name)) as 'Stt', Id, Name, Url, Description 
        FROM ${TBL_CATEGORIES_SUB} 
        WHERE IsDelete = 1 AND IdCategoriesMain = ${id} ORDER BY Name
        limit ${limit} offset ${offset}`);
    },
    countAllSub_Id_Provisional: function (id) {
        return db.load(`SELECT count(*) as 'SoLuong' 
        FROM ${TBL_CATEGORIES_SUB} 
        WHERE IsDelete = 1 AND IdCategoriesMain = ${id} ORDER BY Name`);
    },
    
    getNameMain: function(id){
        return db.load(`SELECT c.Name FROM ${TBL_CATEGORIES_SUB} s, ${TBL_CATEGORIES} c WHERE s.Id = ${id} and s.IdCategoriesMain = c.Id`);
        
    },
    singleIdMain: function (id) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Id = '${id}' and IsDelete = 0`);
    },
    singleIdMain_Provision: function (id) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Id = '${id}' and IsDelete = 1`);
    },
    singleNameMain: function (name) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Name = '${name}' and IsDelete = 0`);
    },
    singleUrlMain: function (url) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Url = '${url}' and IsDelete = 0`);
    },
    singleNameMainEdit: function (name, id) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Name = '${name}' and Id != ${id} and IsDelete = 0`); 
    },
    singleUrlMainEdit: function (url, id) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE Url = '${url}' and Id != ${id}  and IsDelete = 0`);
    },
    singleIdSub_Provision: function (id) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Id = '${id}' and IsDelete = 1`);
    },
    singleNameSub: function (name) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Name = '${name}' and IsDelete = 0`);
    },
    singleUrlSub: function (url) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Url = '${url}' and IsDelete = 0`);
    },
    singleNameSubEdit: function (name, id) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Name = '${name}' and Id != ${id} and IsDelete = 0`);
    },
    singleUrlSubEdit: function (url, id) {
        return db.load(`SELECT * FROM ${TBL_CATEGORIES_SUB} WHERE Url = '${url}' and Id != ${id} and IsDelete = 0`);
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

    ProvisionMain: function (id) {
        const condition = {
          Id: id
        }
        return db.del_provisional(TBL_CATEGORIES, condition);
    },
    ProvisionSub: function (id) {
        const condition = {
          Id: id
        }
        return db.del_provisional(TBL_CATEGORIES_SUB, condition);
    },
    activateMain: function (id) {
        const condition = {
          Id: id
        }
        return db.activate(TBL_CATEGORIES, condition);
    },
    activateSub: function (id) {
        const condition = {
          Id: id
        }
        return db.activate(TBL_CATEGORIES_SUB, condition);
    },
    allMain_Posts: function () {
        return db.load(`SELECT Id, Name, Url
        FROM ${TBL_CATEGORIES} 
        WHERE IsDelete = 0`);
    },
    allSub_Posts: function () {
        return db.load(`SELECT Id, Name, Url, IdCategoriesMain
        FROM ${TBL_CATEGORIES_SUB}
        WHERE IsDelete = 0`);
    }
};