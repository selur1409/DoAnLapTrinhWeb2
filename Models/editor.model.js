const db = require('../utils/db');
const TBL_CATEGORIES = 'categories';
const TBL_CATEGORIES_SUB = 'categories_sub';
const TBL_TAG_POSTS = 'tag_posts';
const TBL_TAGS ='tags';
const TBL_POSTS= 'posts';
const TBL_EDITOR_ACCOUNT= 'editoraccount';
const TBL_STATUS_POSTS ='status_posts';
const TBL_FEED_BACK ='feedback';
const TBL_POST_DETAILS ='postdetails';
const TBL_INFORMATION ='information';
const TBL_ACCOUNTS='accounts';

module.exports = {
    LoadTagOfPost: (idPost) => {
        return db.load(`SELECT DISTINCT t.Id, t.Name,t.TagName 
            FROM ${TBL_TAG_POSTS} tp, tags t, posts p 
                WHERE t.Id=tp.IdTag AND tp.IdPost=p.Id AND p.Id=${idPost} and p.IsDelete=0 AND t.IsDelete=0`);
    },
    LoadAllTags: () => {
        return db.load(`SELECT Id, TagName, Name 
            FROM ${TBL_TAGS} 
                WHERE IsDelete=0`);
    },
    LoadCateSubOfPost: (idPost) => {
        return db.load(`SELECT DISTINCT catesub.IdCategoriesMain, p.IdCategories, catesub.Name 
            FROM ${TBL_POSTS} p, ${TBL_CATEGORIES_SUB} catesub 
                WHERE p.Id=${idPost} AND p.IdCategories=catesub.Id AND p.IsDelete=0 AND catesub.IsDelete=0`)
    },

    LoadCategoriesOfEditor: (IdAccount) => {
        return db.load(`SELECT edtacc.IdCategories, cate.Name 
            FROM ${TBL_EDITOR_ACCOUNT} edtacc, ${TBL_CATEGORIES} cate 
                WHERE IdAccount =${IdAccount} and edtacc.IsDelete=0 AND cate.Id=edtacc.IdCategories ORDER BY edtacc.IdCategories ASC`);
    },
    LoadPostIsPending: (postStatus, idCategories) => {
        return db.load(`SELECT p.Id, p.Title,p.Content_Summary,p.DatePost,p.Avatar,p.IdCategories,p.IdStatus, cate.Name as'cateName',catesub.Name as 'cateSubName', st.Name as'statusName' 
            FROM ${TBL_POSTS} p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub, ${TBL_STATUS_POSTS} st 
                WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
                    AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id`);
    },
    LoadPostIsAccept: (postStatus, idCategories) => {
        return db.load(`SELECT p.Id, p.Title,p.Content_Summary, p.DatePost,p.DatetimePost, p.Avatar,p.IdCategories,p.IdStatus, cate.Name as'cateName',catesub.Name as 'cateSubName', st.Name as'statusName' 
            FROM ${TBL_POSTS} p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub, ${TBL_STATUS_POSTS} st 
                WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
                    AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id`);
    },
    LoadPostIsDeny: (postStatus, idCategories) => {
        return db.load(`SELECT p.Id, p.Title,p.Content_Summary, p.DatePost,fb.Note, p.Avatar,p.IdCategories,p.IdStatus, cate.Name as'cateName',catesub.Name as 'cateSubName', st.Name as'statusName' 
            FROM ${TBL_POSTS} p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub, ${TBL_STATUS_POSTS} st, ${TBL_FEED_BACK} fb 
                WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
                    AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id  AND fb.IdPost=p.Id AND fb.IsDelete=0`);
    },

    LoadSinglePost: (idPost) => {
        return db.load(`SELECT Id, Title, Content_Full, Content_Summary, DatePost, IdCategories 
            FROM ${TBL_POSTS} 
                WHERE Id=${idPost} AND IsDelete=0`);
    },

    LoadCateById: (idCateSub) => {
        return db.load(`SELECT cate.Name as 'CateName', p.Id as 'idPost', cate.Id as 'idCategories' 
            FROM ${TBL_POSTS} p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} catesub 
                WHERE catesub.Id=p.IdCategories and p.IdCategories=${idCateSub} and 
                    cate.Id=catesub.IdCategoriesMain AND p.IsDelete=0 AND cate.IsDelete=0 AND catesub.IsDelete=0`);
    },

    LoadInforPost: (idPost) => {
        return db.load(`SELECT i.Nickname, p.IdCategories, p.Title,p.Id,p.Content_Summary 
            FROM ${TBL_POSTS} p, ${TBL_POST_DETAILS} pdt, ${TBL_INFORMATION} i 
                WHERE p.Id=pdt.IdPost AND pdt.IdAccount=i.IdAccount AND p.Id=${idPost} AND p.IsDelete=0`)
    },
    UpdateStatusPost: (entity) =>{
        const condition = {
            Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_POSTS, entity, condition);
    },
    InsertFeedbackPost: (value) => {
        return db.insert(`INSERT INTO feedback(??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)`, value);
    },
    LoadCateSub: (idCategories) => {
        return db.load(`SELECT Name, Id 
            from ${TBL_CATEGORIES_SUB} 
                WHERE IdCategoriesMain=${idCategories} AND IsDelete=0`)
    },
    LoadPostPending_Limit: (postStatus, idCategories, idCategoriesSub, limit, offset) => {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY p.Id)) as 'Stt', p.Id, p.Url, 
        p.Title,p.Content_Summary,p.DatePost,p.Avatar,p.IdCategories,p.IdStatus, 
        cate.Name as'cateName',catesub.Name as 'cateSubName',
        st.Name as'statusName' 
            FROM ${TBL_POSTS} p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub, ${TBL_STATUS_POSTS} st 
                WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
                    AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id AND catesub.Id=${idCategoriesSub}
                    limit ${limit} offset ${offset}`);
    },
    LoadPostAccept_Limit: (postStatus, idCategories, idCategoriesSub, limit, offset) => {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY p.Id)) as 'Stt', p.Id, p.Url, p.Title,
        p.Content_Summary, p.DatePost,p.DatetimePost, p.Avatar,p.IdCategories,p.IdStatus, cate.Id as 'cateId',
        cate.Name as'cateName',catesub.Name as 'cateSubName',
        st.Name as'statusName' 
            FROM ${TBL_POSTS} p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub, ${TBL_STATUS_POSTS} st 
                WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
                    AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id AND catesub.Id=${idCategoriesSub}
                    limit ${limit} offset ${offset}`);
    },
    LoadPostDeny_Limit: (postStatus, idCategories, idCategoriesSub, limit, offset) => {
        return db.load(`SELECT (ROW_NUMBER() OVER (ORDER BY p.Id)) as 'Stt', p.Id, p.Url,
        p.Title,p.Content_Summary, p.DatePost,fb.Note, p.Avatar,p.IdCategories,p.IdStatus, cate.Id as 'cateId',
        cate.Name as'cateName',catesub.Name as 'cateSubName',
        st.Name as'statusName'
            FROM ${TBL_POSTS} p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub, ${TBL_STATUS_POSTS} st, ${TBL_FEED_BACK} fb
                WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
                    AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id AND catesub.Id=${idCategoriesSub} 
                    AND fb.IdPost=p.Id AND fb.IsDelete=0
                    limit ${limit} offset ${offset}`);
    },
    CountPost: (postStatus, idCategories, idCategoriesSub) => {
        return db.load(`SELECT count(*) as'SoLuong' 
            FROM posts p, ${TBL_CATEGORIES} cate, ${TBL_CATEGORIES_SUB} cateSub, ${TBL_STATUS_POSTS} st 
                WHERE p.IdCategories=cateSub.Id AND cateSub.IdCategoriesMain=cate.Id AND cate.Id=${idCategories}
                    AND p.IsDelete=0 AND p.IsDelete=0 AND p.IdStatus=${postStatus} AND p.IdStatus=st.Id AND catesub.Id=${idCategoriesSub}`)
    },
    DeleteTagsOfPost: (id) => {
        const condition = {
            IdPost: id
        }
        return db.del_notsafe_with_condition(TBL_TAG_POSTS, condition);
    },
    InsertTagsPost: (value) => {
        return db.insert(`INSERT INTO ${TBL_TAG_POSTS}(??, ??) VALUES (?, ?)`, value);
    },
    LoadCateFromIdCateSub:(idCateSub)=>
    {
        return db.load(`SELECT cate.Id, cate.Name 
            FROM ${TBL_CATEGORIES_SUB} catesub, ${TBL_CATEGORIES} cate 
                WHERE catesub.Id=${idCateSub} and cate.IsDelete=0 AND catesub.IsDelete=0 and cate.Id=catesub.IdCategoriesMain`)
    },
    LoadFeedBackOfPosts:(idPost)=>
    {
        return db.load(`SELECT Id, Note 
            FROM feedback 
                WHERE IdPost=${idPost} AND IsDelete=0`);
    },
    UpdateFeedBackOfPosts:(entity)=>{
        const condition = {
            Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_FEED_BACK, entity, condition);
    },
    DeleteFeedBackOfPosts:(id)=>{
        const condition = {
            Id: id
        }
        return db.del_notsafe_with_condition(TBL_FEED_BACK, condition);
    },
    UpdateIsPremium:(entity)=>{
        const condition = {
            IdPost: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_POST_DETAILS, entity, condition);
    }
}