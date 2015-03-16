'use strict';

/* Empty results object for dashboard view with invalid tag */
module.exports.EMPTY_RESULTS_OBJECT = {
    searchTerm: '&nbsp;',
    listings: [],
    tagsSorted: [],
    total: 0,
    viewsDaily: 0
};

/* Error messages to be rendered in views */
module.exports.ERRORS = {
    apiLimit: 'Oh no! There was an error with the Etsy API or we\'ve reached' +
        ' our max number of requests for the day. We\'ll look into it ASAP.',
    invalidTag: 'Oops! It looks like your search was empty or included' +
        ' an invalid tag. Try starting a new search with a different tag.',
    noResults: 'Looks like your tag is one of a kind! Etsy couldn\'t find any' +
        ' listings using that search term. Check to make sure your tag wasn\'t' +
        ' misspelled or longer than 20 characters.'
};

/* Keys for SortBy method of Results object */
module.exports.SORT_KEYS = {
    'creation': 'original_creation_tsz',
    'daily': 'viewsDaily',
    'favorites': 'num_favorers',
    'price': 'price',
    'relevancy': 'relevancy',
    'views': 'views'
};