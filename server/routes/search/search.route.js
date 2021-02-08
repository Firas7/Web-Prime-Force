const handler = require('./handler');

module.exports = [
  {
    method: 'GET',
    path: '/api/search/{searchTerm}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'contracts'],
      plugins: {
        'hapi-swagger': {
          //responses: outputValidations.getDynamicSearch
        },
      },
      description: 'Search for the searchTerm',
    },
    handler: handler.getSearchTermHandler,
  },
];
