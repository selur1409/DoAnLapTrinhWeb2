const db = require('../utils/db');
module.exports = {
    LoadTag:()=>{
        return db.load(`SELECT * FROM tags`);
    },

    LoadCategories:()=>{
        return db.load(`SELECT * FROM categories`);
    },

    LoadSubCategories:()=>{
        return db.load(`SELECT * FROM categories_sub`);
    },

    InsertPost:(value)=>{
        return db.insert(`INSERT INTO posts(??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, value);
    },
    
    InsertTagPost:(value)=>{
        return db.insert(`INSERT INTO tag_posts(??, ??) VALUES ?`, value);
    },

    InsertPostDetail:(value)=>{
        return db.insert(`INSERT INTO postdetails(??, ??, ??) VALUES (?, ?, ?)`, value);
    },

    LoadPostOfWriter:(IdStatus, IdAccount)=>{
        return db.load(`SELECT p.* FROM posts p, postdetails pd, accounts ac WHERE ac.Id = pd.IdAccount AND pd.IdPost = p.Id AND p.IdStatus = '${IdStatus}' AND ac.Id = '${IdAccount}'`);
    },

    LoadSinglePost:(value)=>{
        return db.load(`SELECT p.* FROM posts p WHERE p.Id = '${value}'`);
    },

    LoadCategoriesById:(value)=>{
        return db.load(`SELECT c.Name AS 'CategorieName', cs.Name AS 'SubCategories' FROM categories c, categories_sub cs WHERE cs.Id = '${value}' AND cs.IdCategoriesMain = c.Id`);
    },

    LoadStatusById:(value)=>{
        return db.load(`SELECT * FROM status_posts s WHERE s.Id = '${value}'`);
    }
}