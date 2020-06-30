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

    LoadPostOfWriter:(IdStatus, IdAccount, Limit, Offset)=>{
        return db.load(`SELECT p.* FROM posts p, postdetails pd, accounts ac WHERE ac.Id = pd.IdAccount AND pd.IdPost = p.Id AND p.IdStatus = '${IdStatus}' AND ac.Id = ${IdAccount} LIMIT ${Limit} OFFSET ${Offset}`);
    },

    LoadSinglePost:(value)=>{
        return db.load(`SELECT p.* FROM posts p WHERE p.Id = '${value}'`);
    },

    LoadCategoriesById:(value)=>{
        return db.load(`SELECT c.Name AS 'CategorieName', cs.Name AS 'SubCategories' FROM categories c, categories_sub cs WHERE cs.Id = '${value}' AND cs.IdCategoriesMain = c.Id`);
    },

    LoadStatusById:(value)=>{
        return db.load(`SELECT * FROM status_posts s WHERE s.Id = '${value}'`);
    },

    CountPostOfWriter:(IdStatus, IdAccount)=>{
        return db.load(`SELECT Count(*) AS Number FROM posts p, postdetails pd, accounts ac WHERE ac.Id = pd.IdAccount AND pd.IdPost = p.Id AND p.IdStatus = '${IdStatus}' AND ac.Id = '${IdAccount}'`);
    },

    UpdatePostOfWriter:(value)=>{
        return db.insert(`UPDATE posts SET Title = ?, Content_Summary = ?, Content_Full = ?, DatePost = ?, Avatar = ?, Views = ?, DatetimePost = ?, IdCategories = ?, IdStatus = ?, IsDelete = ? WHERE Id = ?`, value);
    },
    UpdatePostDetail:(FullCont, id)=>{
        return db.insert(`UPDATE postdetails SET Content_Full = '${FullCont}' WHERE IdPost = ${id}`);
    },
    DeleteTagPost:(IdPost)=>{
        return db.load(`DELETE FROM tag_posts WHERE IdPost = ${IdPost}`);
    },

    CountNumberPost:(IdAccount)=>{
        return db.load(`SELECT st.*, (SELECT Count(*) FROM posts p, postdetails pd, accounts ac WHERE p.Id = pd.IdPost AND pd.IdAccount = ac.Id AND ac.Id = ${IdAccount} AND st.Id = p.IdStatus)  AS 'Number'
        FROM status_posts st`);
    },

    LoadInboxFB:(IdPost, Limit, OffSet)=>{
        return db.load(`SELECT fb.Id, fb.Note, fb.IdPost, fb.Status, fb.DatetimeApproval, inf.Name
        FROM feedback fb, editoraccount ec, information inf 
        WHERE fb.IdEditorAccount = ec.Id AND ec.IdAccount = inf.IdAccount AND fb.IdPost = ${IdPost} AND fb.IsDelete = 0 LIMIT ${Limit} OFFSET ${OffSet}`);
    },

    LoadFB:(Id)=>{
        return db.load(`SELECT fb.Id, fb.Note, fb.IdPost, fb.Status, fb.DatetimeApproval, inf.Name
        FROM feedback fb, editoraccount ec, information inf
        WHERE fb.Id = ${Id} AND fb.IdEditorAccount = ec.Id AND ec.IdAccount = inf.IdAccount`);
    },

    CountFB:(IdPost)=>{
        return db.load(`SELECT count(fb.IdPost) AS 'Number'
        FROM feedback fb, editoraccount ec, information inf 
        WHERE fb.IdEditorAccount = ec.Id AND ec.IdAccount = inf.IdAccount AND fb.IdPost = ${IdPost}`);
    }
}