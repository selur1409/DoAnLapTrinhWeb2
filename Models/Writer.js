const db = require('../utils/db');
module.exports = {

    LoadTag: () => {
        return db.load(`SELECT * FROM tags`);
    },

    LoadCategories: () => {
        return db.load(`SELECT * FROM categories`);
    },

    LoadSubCategories: () => {
        return db.load(`SELECT * FROM categories_sub`);
    },

    InsertPost: (value) => {
        return db.insert(`INSERT INTO posts(??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, value);
    },

    InsertTagPost: (value) => {
        return db.insert(`INSERT INTO tag_posts(??, ??) VALUES ?`, value);
    }
}