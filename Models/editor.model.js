const db = require('../utils/db');
const TBL_CATEGORIES = 'categories';
const TBL_CATEGORIES_SUB = 'categories_sub';
const TBL_TAG_POSTS = 'tag_posts';


module.exports = {
    LoadTagOfPost: (idPost) => {
        return db.load(`SELECT DISTINCT t.Id, t.Name,t.TagName FROM tag_posts tp, tags t, posts p WHERE t.Id=tp.IdTag AND tp.IdPost=p.Id AND p.Id=${idPost} and p.IsDelete=0 AND t.IsDelete=0`);
    },
    LoadAllTags: () => {
        return db.load(`SELECT Id, TagName, Name FROM tags WHERE IsDelete=0`);
    },
    LoadCategoriesOfPost: (idPost) => {
        return db.load(`SELECT DISTINCT catesub.IdCategoriesMain, p.IdCategories, catesub.Name FROM posts p, ${TBL_CATEGORIES_SUB} catesub WHERE p.Id=${idPost} AND p.IdCategories=catesub.Id AND p.IsDelete=0 AND catesub.IsDelete=0`)
    },

    LoadCategoriesOfEditor: (IdAccount) => {
        return db.load(`SELECT edtacc.IdCategories, cate.Name FROM editoraccount edtacc, ${TBL_CATEGORIES} cate WHERE IdAccount =${IdAccount} and edtacc.IsDelete=0 AND cate.Id=edtacc.IdCategories ORDER BY edtacc.IdCategories ASC`);
    },
    LoadPostIsPending: (postStatus, idCategories) => {
        return db.load(`SELECT p.Id, p.Title,p.Content_Summary,p.DatePost,p.Avatar,p.IdCategories,p.IdStatus, cate.Name as'cateName',catesub.Name as 'cateSubName',
         st.Name as'statusName' FROM posts p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub,
          status_posts st WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
           AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id`);
    },
    LoadPostIsAccept: (postStatus, idCategories) => {
        return db.load(`SELECT p.Id, p.Title,p.Content_Summary, p.DatePost,p.DatetimePost, p.Avatar,p.IdCategories,p.IdStatus, cate.Name as'cateName',catesub.Name as 'cateSubName',
         st.Name as'statusName' FROM posts p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub,
          status_posts st WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
           AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id`);
    },
    LoadPostIsDeny: (postStatus, idCategories) => {
        return db.load(`SELECT p.Id, p.Title,p.Content_Summary, p.DatePost,fb.Note, p.Avatar,p.IdCategories,p.IdStatus, cate.Name as'cateName',catesub.Name as 'cateSubName',
         st.Name as'statusName' FROM posts p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub,
          status_posts st, feedback fb WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
           AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id  AND fb.IdPost=p.Id AND fb.IsDelete=0`);
    },

    LoadSinglePost: (idPost) => {
        return db.load(`SELECT Id, Title, Content_Full, DatePost FROM posts WHERE Id=${idPost} AND IsDelete=0`);
    },

    LoadCategoriesById: (value) => {
        return db.load(`SELECT cate.Name as 'CateName', p.Id as 'idPost', cate.Id as 'idCategories' FROM 
        posts p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} catesub WHERE catesub.Id=p.IdCategories and p.IdCategories=${value} and 
        cate.Id=catesub.IdCategoriesMain AND p.IsDelete=0 AND cate.IsDelete=0 AND catesub.IsDelete=0`);
    },

    LoadInforPost: (idPost) => {
        return db.load(`SELECT i.Nickname, p.IdCategories, p.Title,p.Id,p.Content_Summary FROM posts p, postdetails pdt, information i WHERE p.Id=pdt.IdPost AND pdt.IdAccount=i.IdAccount AND p.Id=${idPost} AND p.IsDelete=0`)
    },
    LoadIdEditor: (idEditor, idCategories) => {
        return db.load(`SELECT edtacc.id FROM accounts acc, editoraccount edtacc WHERE acc.Id=edtacc.IdAccount AND acc.Id=${idEditor} AND edtacc.IdCategories=${idCategories} AND acc.IsDelete=0 and edtacc.IsDelete=0`)
    },
    UpdateStatusPost: function (entity) {
        const condition = {
            Id: entity.Id
        }
        delete entity.Id;
        return db.patch('posts', entity, condition);
    },
    InsertFeedbackPost: (value) => {
        return db.insert(`INSERT INTO feedback(??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?)`, value);
    },
    LoadSubCategories: (idCategories) => {
        return db.load(`SELECT Name, Id from ${TBL_CATEGORIES_SUB} WHERE IdCategoriesMain=${idCategories} AND IsDelete=0`)
    },
    LoadTagsNotOfPost: (idPost) => {
        return db.load(`SELECT Name FROM tags WHERE TagName NOT IN(SELECT t.TagName FROM posts p, tag_posts tp, tags t WHERE p.Id=tp.IdPost AND p.Id=${idPost} AND tp.IdTag =t.Id)`);
    },
    LoadPostPending_Limit: (postStatus, idCategories, idCategoriesSub, limit, offset) => {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY p.Id)) as 'Stt', p.Id, p.Url, 
        p.Title,p.Content_Summary,p.DatePost,p.Avatar,p.IdCategories,p.IdStatus, 
        cate.Name as'cateName',catesub.Name as 'cateSubName',
        st.Name as'statusName' 
        FROM posts p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub, status_posts st 
        WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
           AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id AND catesub.Id=${idCategoriesSub}
        limit ${limit} offset ${offset}`);
    },
    LoadPostAccept_Limit: (postStatus, idCategories, idCategoriesSub, limit, offset) => {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY p.Id)) as 'Stt', p.Id, p.Url, p.Title,
        p.Content_Summary, p.DatePost,p.DatetimePost, p.Avatar,p.IdCategories,p.IdStatus, 
        cate.Name as'cateName',catesub.Name as 'cateSubName',
        st.Name as'statusName' 
        FROM posts p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub, status_posts st 
        WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
           AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id AND catesub.Id=${idCategoriesSub}
        limit ${limit} offset ${offset}`);
    },
    LoadPostDeny_Limit: (postStatus, idCategories, idCategoriesSub, limit, offset) => {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY p.Id)) as 'Stt', p.Id, p.Url,
        p.Title,p.Content_Summary, p.DatePost,fb.Note, p.Avatar,p.IdCategories,p.IdStatus, 
        cate.Name as'cateName',catesub.Name as 'cateSubName',
        st.Name as'statusName'
        FROM posts p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub, status_posts st, feedback fb
        WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
           AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id AND catesub.Id=${idCategoriesSub} 
           AND fb.IdPost=p.Id AND fb.IsDelete=0
        limit ${limit} offset ${offset}`);
    },
    CountPost: (postStatus, idCategories, idCategoriesSub) => {
        return db.load(`SELECT count(*) as'SoLuong' FROM posts p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub,
         status_posts st WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
          AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id AND catesub.Id=${idCategoriesSub}`)
    },
    DeleteTagsOfPost: (id) => {
        const condition = {
            IdPost: id
        }
        return db.del(TBL_TAG_POSTS, condition);
    },
    InsertTagsPost: (value) => {
        return db.insert(`INSERT INTO tag_posts(??, ??) VALUES (?, ?)`, value);
    }
}