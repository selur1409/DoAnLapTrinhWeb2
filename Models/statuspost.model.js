const db = require('../utils/db');
const TBL_STATUS = 'status_posts'

module.exports = {
    all: function () {
        return db.load(`select Id, Name from ${TBL_STATUS} where IsDelete = 0`);
    },

};