const db = require('../utils/db');

module.exports = {
    LoadTagOfPost:(idPost)=>{
        return db.load(`SELECT t.Name,t.TagName FROM tag_posts tp, tags t, posts p WHERE t.Id=tp.IdTag AND tp.IdPost=p.Id AND p.Id=${idPost}`);
    },
    LoadCategoriesOfPost:(idPost)=>{
        return db.load(`SELECT DISTINCT catesub.IdCategoriesMain, p.IdCategories FROM posts p, categories_sub catesub WHERE p.Id=${idPost} AND p.IdCategories=catesub.Id`)
    },

    LoadCategoriesOfEditor:(IdAccount)=>{
        return db.load(`SELECT * FROM editoraccount WHERE IdAccount =${IdAccount}`);
    },
    InsertTagPost:(value)=>{
        return db.insert(`INSERT INTO tag_posts(??, ??) VALUES ?`, value);
    },

    LoadStatusPost:(idStatus)=>{
        return db.load(`SELECT Name FROM status_posts WHERE Id ='${idStatus}'`, value);
    },

    InsertPostDetail:(value)=>{
        return db.insert(`INSERT INTO postdetails(??, ??, ??) VALUES (?, ?, ?)`, value);
    },

    LoadPostIsPending:(postStatus,idCategories)=>{
        return db.load(`SELECT p.Id, p.Title,p.Content_Summary,p.DatePost,p.Avatar,p.IdCategories,p.IdStatus, cate.Name as'cateName',catesub.Name as 'cateSubName',
         st.Name as'statusName' FROM posts p, categories cate, categories_sub cateSub,
          status_posts st WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories} AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id`);
    },

    LoadSinglePost:(value)=>{
        return db.load(`SELECT p.Id,p.Title,p.Content_Full,p.DatePost FROM posts p WHERE p.Id=${value}`);
    },

    LoadCategoriesById:(value)=>{
        return db.load(`SELECT cate.Name as 'CateName', p.Id as 'idPost', cate.Id as 'idCategories' FROM posts p, categories cate, categories_sub catesub WHERE catesub.Id=p.IdCategories and p.IdCategories=${value} and cate.Id=catesub.IdCategoriesMain`);
    },

    LoadStatusById:(value)=>{
        return db.load(`SELECT * FROM status_posts s WHERE s.Id = ${value}`);
    },
    LoadAuthorOfPost:(idPost)=>{
        return db.load(`SELECT i.Nickname FROM posts p, postdetails pdt, information i WHERE p.Id=pdt.IdPost AND pdt.IdAccount=i.IdAccount AND p.Id=${idPost}`)
    },
    LoadIdEditor:(idEditor,idCategories)=>{
        return db.load(`SELECT edtacc.id FROM accounts acc, editoraccount edtacc WHERE acc.Id=edtacc.IdAccount AND acc.Id=${idEditor} AND edtacc.IdCategories=${idCategories}`)
    },
    UpdateStatusPost:function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch('posts', entity, condition);
    },
    InsertFeedbackPost:(value)=>{
        return db.insert(`INSERT INTO feedback(??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?)`,value);
    },
    LoadSubCategories:(idCategories)=>{
        return db.load(`SELECT catesub.Name,catesub.Id from categories_sub catesub WHERE catesub.IdCategoriesMain=${idCategories}`)
    }

}