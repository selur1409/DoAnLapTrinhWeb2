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
    },
    pageLinks: (page, total) => {
      const nPages = Math.ceil(total / config.pagination.limit);
      const page_items = [];
      let count = 0;
      let lengthPagination = 0;
      let temp = page;

      while (true) {
          if (temp - config.pagination.limitPaginationLinks > 0) {
              count++;
              temp = temp - config.pagination.limitPaginationLinks;
          }
          else {
              break;
          }
      }
      if ((count * config.pagination.limitPaginationLinks) + config.pagination.limitPaginationLinks >= nPages) {
          lengthPagination = nPages;
      }
      else {
          lengthPagination = (count * config.pagination.limitPaginationLinks) + config.pagination.limitPaginationLinks;
      }
      for (let i = (count * config.pagination.limitPaginationLinks) + 1; i <= lengthPagination; i++) {
          const item = {
              value: i,
              isActive: i === page
          }
          page_items.push(item);
      }            
      
      const entity = {};
      entity.prev_value = page - 1;
      entity.next_value = page + 1;
      entity.can_go_prev = page > 1;
      entity.can_go_next = page < nPages;

      const cost = Math.ceil(page / config.pagination.limitPaginationLinks);
      entity.next_forward_value = (cost * config.pagination.limitPaginationLinks) + 1;
      entity.can_go_next_forward = true;
      if (entity.next_forward_value > nPages){
        entity.can_go_next_forward = false;
      }
      
      entity.prev_backward_value = (cost - 1) * config.pagination.limitPaginationLinks;
      entity.can_go_prev_backward = true;
      if (entity.prev_backward_value <= 0){
        entity.can_go_prev_backward = false;
      }
      return [page_items, entity];
    }
}