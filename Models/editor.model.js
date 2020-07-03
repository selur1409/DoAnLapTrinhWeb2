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
    
    InsertTagPost:(value)=>{
        return db.insert(`INSERT INTO tag_posts(??, ??) VALUES ?`, value);
    },

    LoadStatusPost:(idStatus)=>{
        return db.load(`SELECT * FROM status_posts WHERE Id ='${idStatus}`, value);
    },

    InsertPostDetail:(value)=>{
        return db.insert(`INSERT INTO postdetails(??, ??, ??) VALUES (?, ?, ?)`, value);
    },

    LoadPostIsPending:(postStatus)=>{
        return db.load(`SELECT * FROM posts WHERE IdStatus ='${postStatus}'`);
    },

    LoadSinglePost:(value)=>{
        return db.load(`SELECT * FROM posts WHERE Id = '${value}'`);
    },

    LoadCategoriesById:(value)=>{
        return db.load(`SELECT c.Name AS 'CategorieName', cs.Name AS 'SubCategories' FROM categories c, categories_sub cs WHERE cs.Id = '${value}' AND cs.IdCategoriesMain = c.Id`);
    },

    LoadStatusById:(value)=>{
        return db.load(`SELECT * FROM status_posts s WHERE s.Id = '${value}'`);
    }
}