const controller = require('../../controller/search.controller');

async function getSearchTermHandler(request) {
  let beginAtIndex = 0;
  let limit = 30;

  if (request.query.beginAtIndex != null) {
    beginAtIndex = request.query.beginAtIndex;
  }
  if (request.query.limit != null) {
    limit = request.query.limit;
  }

  return await controller.search(
    request.params.searchTerm,
    beginAtIndex,
    limit
  );
}

module.exports = {
  getSearchTermHandler: getSearchTermHandler,
};
