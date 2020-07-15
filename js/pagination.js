const config = require('../config/default.json');
module.exports = {
    page: (page, total) => {
        const nPages = Math.ceil(total / config.pagination.limit);
        const page_items = [];

        for (let i = 1; i <= nPages; i++) {
            const item = {
              value: i,
              isActive: i === page
            }
            page_items.push(item);
          }
        return [nPages, page_items];
    }
}