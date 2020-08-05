const db = require('../utils/db');
module.exports = {
    LoadTag:()=>{
        return db.load(`SELECT * FROM tags WHERE IsDelete = 0`);
    },

    LoadCategories:()=>{
        return db.load(`SELECT * FROM categories WHERE IsDelete = 0`);
    },

    LoadTagOfPost:(IdPost)=>{
        return db.load(`SELECT * FROM tag_posts tp WHERE tp.IdPost = ${IdPost}`)
    },

    CheckTitleIsExistsInPost:(title, Url)=>{
        return db.load(`SELECT * 
        FROM posts 
        WHERE Title = '${title}' OR Url = '${Url}'`);
    },

    CheckTitleIsExistsInUpdate:(title, Url, IdPost)=>{
        return db.load(`SELECT * FROM posts WHERE (Title = '${title}' OR Url = '${Url}') AND Id = ${IdPost}`);
    },

    LoadSubCategories:()=>{
        return db.load(`SELECT * FROM categories_sub WHERE IsDelete = 0`);
    },

    InsertPost:(value)=>{
        return db.insert(`INSERT INTO posts(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, value);
    },
    
    InsertTagPost:(value)=>{
        return db.insert(`INSERT INTO tag_posts(??, ??) VALUES ?`, value);
    },

    InsertPostDetail:(value)=>{
        return db.insert(`INSERT INTO postdetails(??, ??) VALUES (?, ?)`, value);
    },

    LoadPostOfWriter:(IdStatus, IdAccount, Limit, Offset)=>{
        return db.load(`SELECT p.Id, p.Title, p.Content_Summary, p.Content_Full, p.DatePost, p.Avatar AS 'ImagePost', p.Views, p.DatetimePost, p.IdCategories, p.IdStatus, inf.Name AS 'NameOfWriter', inf.Avatar AS 'AvatarPost' FROM posts p, postdetails pd, accounts ac, information inf WHERE pd.IdAccount = inf.IdAccount AND ac.Id = pd.IdAccount AND pd.IdPost = p.Id AND p.IdStatus = '${IdStatus}' AND ac.Id = ${IdAccount} ORDER BY p.DatePost LIMIT ${Limit} OFFSET ${Offset}`);
    },

    LoadPostOfWriterBySearch:(IdAccount, Limit, Offset, Value)=>{
        return db.load(`SELECT p.Id, p.Title, p.Content_Summary, p.Content_Full, p.DatePost, p.Avatar AS 'ImagePost', p.Views, p.DatetimePost, p.IdCategories, p.IdStatus, inf.Name AS 'NameOfWriter', inf.Avatar AS 'AvatarPost'
        FROM posts p, postdetails pd, (SELECT * FROM information inf WHERE inf.IdAccount = ${IdAccount}) inf
        WHERE MATCH(p.Title, p.Content_Summary, p.Content_Full) AGAINST ('${Value}' IN NATURAL LANGUAGE MODE) AND p.Id = pd.IdPost AND pd.IdAccount = ${IdAccount}
        LIMIT ${Limit} OFFSET ${Offset}`);
    },

    LoadPostOfWriterThisWeek:(IdStatus, IdAccount, Limit, Offset)=>{
        return db.load(`SELECT p.Id, p.Title, p.Content_Summary, p.Content_Full, p.DatePost, p.Avatar AS 'ImagePost', p.Views, p.DatetimePost, p.IdCategories, p.IdStatus, inf.Name AS 'NameOfWriter', inf.Avatar AS 'AvatarPost' FROM posts p, postdetails pd, accounts ac, information inf WHERE pd.IdAccount = inf.IdAccount AND ac.Id = pd.IdAccount AND pd.IdPost = p.Id AND p.IdStatus = '${IdStatus}' AND ac.Id = ${IdAccount} AND p.DatePost BETWEEN DATE_SUB(CURDATE() , INTERVAL 6 DAY) AND CURDATE() ORDER BY p.DatePost LIMIT ${Limit} OFFSET ${Offset}`);
    },

    LoadPostOfWriterThisDayOrThisMonthOrThisYear:(IdStatus, IdAccount, Limit, Offset, DayOrMonthOrYear)=>{
        return db.load(`SELECT p.Id, p.Title, p.Content_Summary, p.Content_Full, p.DatePost, p.Avatar AS 'ImagePost', p.Views, p.DatetimePost, p.IdCategories, p.IdStatus, inf.Name AS 'function', inf.Avatar AS 'AvatarPost' FROM posts p, postdetails pd, accounts ac, information inf WHERE pd.IdAccount = inf.IdAccount AND ac.Id = pd.IdAccount AND pd.IdPost = p.Id AND p.IdStatus = '${IdStatus}' AND ac.Id = ${IdAccount} AND p.DatePost BETWEEN  DATE_FORMAT(CURDATE() ,'${DayOrMonthOrYear}') AND CURDATE() ORDER BY p.DatePost LIMIT ${Limit} OFFSET ${Offset}`)
    },

    LoadTheLastPost:()=>{
        return db.load(`SELECT p.* FROM posts p ORDER BY Id DESC LIMIT 1`);
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

    CountAllPost:(IdAccount)=>{
        return db.load(`SELECT Count(*) AS Number FROM posts p, postdetails pd, accounts ac WHERE ac.Id = pd.IdAccount AND pd.IdPost = p.Id AND ac.Id = '${IdAccount}'`);

    },

    CountPostOfWriter:(IdStatus, IdAccount)=>{
        return db.load(`SELECT Count(*) AS Number FROM posts p, postdetails pd, accounts ac WHERE ac.Id = pd.IdAccount AND pd.IdPost = p.Id AND p.IdStatus = '${IdStatus}' AND ac.Id = '${IdAccount}'`);
    },

    CountPostOfWriterThisWeek:(IdStatus, IdAccount)=>{
        return db.load(`SELECT Count(*) AS Number FROM posts p, postdetails pd, accounts ac WHERE ac.Id = pd.IdAccount AND pd.IdPost = p.Id AND p.IdStatus = '${IdStatus}' AND ac.Id = '${IdAccount}' AND p.DatePost BETWEEN  DATE_SUB(CURDATE() , INTERVAL 6 DAY) AND CURDATE()`);
    },

    CountPostOfWriterThisDayOrThisMonthOrThisYear:(IdStatus, IdAccount, ThisDayOrMonthOrYear)=>{
        return db.load(`SELECT Count(*) AS Number FROM posts p, postdetails pd, accounts ac WHERE ac.Id = pd.IdAccount AND pd.IdPost = p.Id AND p.IdStatus = '${IdStatus}' AND ac.Id = '${IdAccount}' AND p.DatePost BETWEEN  DATE_FORMAT(CURDATE() , '${ThisDayOrMonthOrYear}') AND CURDATE()`);
    },

    CountPostSearch:(IdAccount, Limit, Offset, Value)=>{
        return db.load(`SELECT Count(*) AS Number
        FROM posts p, postdetails pd, (SELECT * FROM information inf WHERE inf.IdAccount = ${IdAccount}) inf
        WHERE MATCH(p.Title, p.Content_Summary, p.Content_Full) AGAINST ('${Value}' IN NATURAL LANGUAGE MODE) AND p.Id = pd.IdPost AND pd.IdAccount = ${IdAccount}`);
    },

    UpdateFullContent:(FullContent, Avatar, Id)=>{
        return db.insert(`UPDATE posts SET Content_Full = '${FullContent}', Avatar = '${Avatar}' WHERE Id = ${Id}`);
    },

    UpdatePostOfWriter:(value)=>{
        return db.insert(`UPDATE posts SET Title = ?, Url = ?, Content_Summary = ?, Content_Full = ?, DatePost = ?, Avatar = ?, Views = ?, DatetimePost = ?, IdCategories = ?, IdStatus = ?, IsDelete = ? WHERE Id = ?`, value);
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

    /*Feedback*/
    LoadInboxFB:(IdPost, Limit, OffSet, IsDelete)=>{
        return db.load(`SELECT fb.Id, fb.Note, fb.IdPost, fb.Status, fb.DatetimeApproval, inf.Name
        FROM feedback fb, editoraccount ec, information inf 
        WHERE fb.IdEditorAccount = ec.Id AND ec.IdAccount = inf.IdAccount AND fb.IdPost = ${IdPost} AND fb.IsDelete = ${IsDelete} LIMIT ${Limit} OFFSET ${OffSet}`);
    },

    LoadFB:(Id)=>{
        return db.load(`SELECT fb.Id, fb.Note, fb.IdPost, fb.Status, fb.DatetimeApproval, inf.Name
        FROM feedback fb, editoraccount ec, information inf
        WHERE fb.Id = ${Id} AND fb.IdEditorAccount = ec.Id AND ec.IdAccount = inf.IdAccount`);
    },

    CountFB:(IdPost, IsDelete)=>{
        return db.load(`SELECT count(fb.IdPost) AS 'Number'
        FROM feedback fb, editoraccount ec, information inf 
        WHERE fb.IdEditorAccount = ec.Id AND ec.IdAccount = inf.IdAccount AND fb.IdPost = ${IdPost} AND fb.IsDelete = ${IsDelete}`);
    },

    RemoveFB:(value)=>{
        return db.insert(`INSERT INTO feedback (Id, IsDelete) VALUES ?
        ON DUPLICATE KEY UPDATE IsDelete=VALUES(IsDelete)`, [value]);
    },
    /*Feedback*/

    /*Profile*/
    LoadProfile:(value)=>{
        return db.load(`SELECT a.Id, a.Username, a.Password_hash, a.TypeAccount, i.Name, i.Nickname, i.Avatar, i.DOB, i.Email, i.Phone, i.Sex, i.IdAccount, ta.Name AS 'Type' 
        FROM accounts a, information i, typeaccount ta 
        WHERE a.Id = i.IdAccount AND ta.Id = a.TypeAccount AND a.IsDelete = 0 AND i.IdAccount = '${value}'`);
    },

    UpdateProfile:(value)=>{
        return db.insert(`UPDATE information SET Name = ?, Nickname = ?, DOB = ?, Email = ?, Phone = ?, Avatar = ? WHERE IdAccount = ?`, value);
    },

    UpdatePassword:(value)=>{
        return db.insert(`UPDATE accounts SET Password_hash = ? WHERE Id = ?`, value);
    }
}