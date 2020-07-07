const db = require('../utils/db');
const TBL_ACCOUNTS = 'accounts';

module.exports = {
    all: function () {
        return db.load(`select * from ${TBL_ACCOUNTS}`);
    },
    single: function (username) {
        return db.load(`SELECT a.Id, a.Username, a.Password_hash, a.TypeAccount, i.Name, i.Nickname, i.Avatar, i.DOB, i.Email, i.Phone, i.Sex, i.IdAccount 
                        FROM ${TBL_ACCOUNTS} a, information i 
                        WHERE a.Id = i.IdAccount and a.IsDelete = 0 and Username = '${username}'`);
    },
    singleId: function (username) {
        return db.load(`select * from ${TBL_ACCOUNTS} where Username = '${username}'`);
    },
    singleEmail: function(email){
        return db.load(`select IdAccount from information where Email = '${email}'`);
    },
    add: function (entity) {
        return db.add(TBL_ACCOUNTS, entity);
    },
    addInfor: function(entity){
        db.add('information', entity);
        return 1;
    },
    patch: function (entity) {
        const condition = {
          Id: entity.Id
        }
        delete entity.Id;
        return db.patch(TBL_ACCOUNTS, entity, condition);
    },
    del: function (id) {
        const condition = {
          Id: id
        }
        return db.del(TBL_ACCOUNTS, condition);
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