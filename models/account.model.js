const db = require('../utils/db');
const TBL_ACCOUNTS = 'accounts';

module.exports = {
    loadFull_select: function (select, limit, offset) {
        return db.load(`select (ROW_NUMBER() OVER (ORDER BY t.Name)) as 'Stt', 
            a.Id, a.Username, i.Name, i.Nickname, i.Sex, i.DOB, a.TypeAccount, a.IsDelete, a.DateRegister, a.DateExpired
        from ${TBL_ACCOUNTS} a, information i, typeaccount t
        where a.Id = i.IdAccount and a.TypeAccount = t.Id and a.typeAccount = ${select}
        limit ${limit} offset ${offset}`);
    },
    countFull_Select: function (select) {
        return db.load(`select count(*) as 'SoLuong'
        from ${TBL_ACCOUNTS} a, information i, typeaccount t
        where a.Id = i.IdAccount and a.TypeAccount = t.Id and a.typeAccount = ${select}`);
    },
    all: function () {
        return db.load(`select * from ${TBL_ACCOUNTS} where IsDelete = 0`);
    },
    allEditor: function () {
        return db.load(`select i.IdAccount, i.Name from ${TBL_ACCOUNTS} a, information i where a.Id = i.IdAccount and
         a.TypeAccount = 3 and a.IsDelete = 0`);
    },
    single: function (username) {
        return db.load(`SELECT a.Id, a.Username, a.Password_hash, a.TypeAccount, a.DateExpired, i.Name, i.Nickname, i.Avatar, i.DOB, i.Email, i.Phone, i.Sex, i.IdAccount, a.IsGoogle
        FROM ${TBL_ACCOUNTS} a, information i 
        WHERE a.Id = i.IdAccount and a.IsDelete = 0 and Username = '${username}'`);
    },
    singleGoogle: function (username) {
        return db.load(`SELECT a.Id, a.Username, a.IsGoogle, a.TypeAccount, a.DateExpired, i.Name, i.Nickname, i.Avatar, i.DOB, i.Email, i.Phone, i.Sex, i.IdAccount 
        FROM ${TBL_ACCOUNTS} a, information i 
        WHERE a.Id = i.IdAccount and a.IsDelete = 0 and Username = '${username}' and a.IsGoogle = 1`);
    },

    singleFacebook: function (username) {
        return db.load(`SELECT a.Id, a.Username, a.IsGoogle, a.TypeAccount, a.DateExpired, i.Name, i.Nickname, i.Avatar, i.DOB, i.Email, i.Phone, i.Sex, i.IdAccount 
        FROM ${TBL_ACCOUNTS} a, information i 
        WHERE a.Id = i.IdAccount and a.IsDelete = 0 and Username = '${username}' and a.IsFacebook = 1`);
    },

    singUsername_Expired: function (username) {
        return db.load(`select a.Id, a.Username, i.Name, i.Sex, i.DOB, i.Email, i.Phone, i.Avatar, a.TypeAccount, a.DateRegister, a.DateExpired, i.Nickname
        from ${TBL_ACCOUNTS} a, information i, typeaccount t
        where a.Id = i.IdAccount and a.TypeAccount = t.Id
        and a.Username = '${username}' and a.IsDelete = 0`);
    },
    singleUser_Resetpassword: function (username) {
        return db.load(`select Id, Password_hash, TypeAccount from ${TBL_ACCOUNTS} where Username = '${username}' and IsDelete = 0`);
    },
    singleId: function (username) {
        return db.load(`select * from ${TBL_ACCOUNTS} where Username = '${username}' and IsDelete = 0`);
    },
    // Dùng trong route admin/accounts
    singleId_editAccount: function (username) {
        return db.load(`select Id from ${TBL_ACCOUNTS} where Username = '${username}' and IsDelete = 0`);
    },
    singleId_editAccount_lo: function (username, limit, offset) {
        return db.load(`select Id from ${TBL_ACCOUNTS} where Username = '${username}' and IsDelete = 0
        limit ${limit} offset ${offset}`);
    },
    countSingleId_editAccount: function (username) {
        return db.load(`select count(Id) as 'SoLuong' from ${TBL_ACCOUNTS} where Username = '${username}' and IsDelete = 0`);
    },
    singleId_MCAccount: function (username) {
        return db.load(`select a.Id, i.Name from ${TBL_ACCOUNTS} a, information i where a.Id = i.IdAccount and a.Username = '${username}' and a.IsDelete = 0`);
    },
    singleId_info_editAccount: function (id) {
        return db.load(`select Id, Avatar from information where IdAccount = ${id}`);
    },
    singleGoogle_check: function(username){
        return db.load(`select Id from ${TBL_ACCOUNTS} where Username = '${username}' and IsGoogle = 1 and IsDelete = 0`);
    },
    singleFacebook_check: function(username){
        return db.load(`select Id from ${TBL_ACCOUNTS} where Username = '${username}' and IsFacebook = 1 and IsDelete = 0`);
    },
    singleEmail: function(email){
        return db.load(`select IdAccount from information where Email = '${email}'`);
    },
    singleEmail_US: function(email, username){
        return db.load(`select IdAccount from information i, ${TBL_ACCOUNTS} a where a.Username != '${username}' and a.Id = i.IdAccount and i.Email = '${email}'`);
    },
    add: function (entity) {
        return db.add(TBL_ACCOUNTS, entity);
    },
    addInfor: function(entity){
        return db.add('information', entity);
    },
    patch: function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_ACCOUNTS, entity, condition);
    },
    patchInfo: function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch('information', entity, condition);
    },
    del: function (id) {
        const condition = {
          Id: id
        }
        return db.del(TBL_ACCOUNTS, condition);
    },
    Provision: function (id) {
        const condition = {
          Id: id
        }
        return db.del_provisional(TBL_ACCOUNTS, condition);
    },
    activate: function (id) {
        const condition = {
          Id: id
        }
        return db.activate(TBL_ACCOUNTS, condition);
    },

    //Forgot Password
    LoadToken:(value)=>{
        return db.load(`SELECT * FROM token WHERE ?? = ? AND ?? = ? AND Expiration > ?`, value);
    },

    UpdateToken:(value)=>{
        return db.insert("UPDATE token SET ?? = ? WHERE ?? = ?", value);
    },

    InsertToken:(value)=>{
        return db.insert("INSERT INTO token (??, ??, ??, ??) VALUES (?, ?, ?, ?)", value);
    },

    DeleteToken:(value)=>{
        return db.insert("DELETE FROM token WHERE ?? = ? OR Expiration < ?", value);
    },

    UpdatePassword:(value)=>{
        return db.insert(`UPDATE accounts SET Password_hash = ? WHERE Id = (SELECT IdAccount FROM information WHERE Email = ?)`, value);
    },

    LoadAccount: (value) => {
        return db.load(`SELECT ac.Id, inf.Name, inf.Email, inf.IdAccount 
                                FROM accounts ac, information inf 
                                WHERE ac.Id = inf.IdAccount AND inf.Email = ?`, value);
    }
};