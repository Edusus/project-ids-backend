const { User, PlayerFantasy, Event, Op } = require('../../databases/db');
const responses = require('../../utils/responses/responses');
const numberOfPages = require('../../utils/helpers/get-number-of-pages');

const rankingDTOPaginate = (res, status, message, myPosition, items, total, page, perPage) => {
  const pages = numberOfPages(total, perPage);
  return res.status(status).json({
    success: true,
    message,
    paginate: {
      total: +total,
      page: +page,
      pages: +pages,
      perPage: +perPage
    },
    myPosition,
    items
  });
}

module.exports = {
    rankingDTOPaginate
}