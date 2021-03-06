const mysql = require('mysql');
const config = require('../config/default.json');

const pool = mysql.createPool(config.mysql_cloud);
module.exports = {
    load: function (sql, value = null) {
      return new Promise(function (resolve, reject) {
        pool.query(sql, value, function (error, results, fields) {
          if (error) {
            return reject(error);
          }
          resolve(results);
        });
      });
    },
  
    add: function (table, entity) {
      return new Promise(function (resolve, reject) {
        const sql = `insert into ${table} set ?`;
        pool.query(sql, entity, function (error, results) {
          if (error) {
            return reject(error);
          }
  
          resolve(results);
        });
      });
    },
  
    patch: function (table, entity, condition) {
      return new Promise(function (resolve, reject) {
        const sql = `update ${table} set ? where ?`;
        pool.query(sql, [entity, condition], function (error, results) {
          if (error) {
            return reject(error);
          }
  
          resolve(results);
        });
      });
    },
  
    del: function (table, condition) {
      return new Promise(function (resolve, reject) {
        const sql = `delete from ${table} where ?`;
        pool.query(sql, condition, function (error, results) {
          if (error) {
            return reject(error);
          }
  
          resolve(results);
        });
      });
    },

    del_notsafe: function (table, id) {
      return new Promise(function (resolve, reject) {
        const sql = `SET SQL_SAFE_UPDATES=0; delete from ${table} where Id = ${id}; SET SQL_SAFE_UPDATES=1;`;
        pool.query(sql, function (error, results) {
          if (error) {
            return reject(error);
          }
          resolve(results);
        });
      });
    },
    del_notsafe_with_condition: function (table, condition) {
      return new Promise(function (resolve, reject) {
        const sql = `SET SQL_SAFE_UPDATES=0; delete from ${table} where ? ; SET SQL_SAFE_UPDATES=1;`;
        pool.query(sql, condition, function (error, results) {
          if (error) {
            return reject(error);
          }
  
          resolve(results);
        });
      });
    },

    del_provisional: function (table, condition) {
      return new Promise(function (resolve, reject) {
        const sql = `update ${table} set isDelete = 1 where ?`;
        pool.query(sql, condition, function (error, results) {
          if (error) {
            return reject(error);
          }
  
          resolve(results);
        });
      });
    },
    activate: function (table, condition) {
      return new Promise(function (resolve, reject) {
        const sql = `update ${table} set isDelete = 0 where ?`;
        pool.query(sql, condition, function (error, results) {
          if (error) {
            return reject(error);
          }
  
          resolve(results);
        });
      });
    },
    

  insert: (sql, value) => {
    return new Promise((resolve, reject) => {
      pool.query(sql, value, (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        else {
          resolve(results);
        }
      });
    });
  }

};