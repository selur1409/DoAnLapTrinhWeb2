const db = require('../utils/db');
const TBL_TAGS = 'tags';

module.exports = {
    all: function () {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY t.Name)) as 'Stt', t.* from ${TBL_TAGS} t where t.IsDelete = 0`);
    },
    all_lo: function (limit, offset) {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY t.Name)) as 'Stt', t.* from ${TBL_TAGS} t where t.IsDelete = 0
        limit ${limit} offset ${offset}`);
    },
    countAll: function () {
        return db.load(`select count(*) as 'SoLuong' from ${TBL_TAGS} t where t.IsDelete = 0`);
    },
    all_Posts: function () {
        return db.load(`select t.Id, t.Name, t.TagName from ${TBL_TAGS} t where t.IsDelete = 0`);
    },
    allActivate: function (limit, offset) {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY t.Name)) as 'Stt', t.* from ${TBL_TAGS} t where t.IsDelete = 1
        limit ${limit} offset ${offset}`);
    },
    countAllActivate: function () {
        return db.load(`select count(*) as 'SoLuong' from ${TBL_TAGS} t where t.IsDelete = 1`);
    },
    listTagHome: function () {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY t.Name)) as 'Stt', t.* from ${TBL_TAGS} t where t.IsDelete = 0 LIMIT 10`);
    },
    single: function (id) {
        return db.load(`SELECT * FROM ${TBL_TAGS} WHERE Id = ${id} and IsDelete = 0`);
    },
    singleActivate: function (id) {
        return db.load(`SELECT Id, Name, TagName FROM ${TBL_TAGS} WHERE Id = ${id} and IsDelete = 1`);
    },
    singleName: function (name) {
        return db.load(`SELECT * FROM ${TBL_TAGS} WHERE Name = '${name}' and IsDelete = 0`);
    },
    singleTagName: function (tagName) {
        return db.load(`SELECT * FROM ${TBL_TAGS} WHERE TagName = '${tagName}' and IsDelete = 0`);
    },
    singleNameDuplicate: function (name, id) {
        return db.load(`SELECT Id FROM ${TBL_TAGS} WHERE Name = '${name}' and Id != ${id} and IsDelete = 0`);
    },
    singleTagNameDuplicate: function (tagName, id) {
        return db.load(`SELECT Id FROM ${TBL_TAGS} WHERE TagName = '${tagName}' and Id != ${id} and IsDelete = 0`);
    },
    tagByIdPost: function (IdPost) {
        return db.load(`SELECT DISTINCT(t.Name), t.TagName FROM tag_posts tp, ${TBL_TAGS} t 
                        WHERE tp.IdTag = t.Id AND tp.IdPost = '${IdPost}' 
                        AND t.IsDelete = 0`);
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