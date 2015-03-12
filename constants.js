'use strict';

/* Empty results object for dashboard view with invalid tag */
module.exports.EMPTY_RESULTS_OBJECT = {
    searchTerm: '&nbsp;',
    listings: [],
    tagsSorted: [],
    total: 0,
    viewsDaily: 0
}

/* Keys for SortBy method of Results object */
module.exports.SORT_KEYS = {
    'creation': 'original_creation_tsz',
    'daily': 'viewsDaily',
    'favorites': 'num_favorers',
    'price': 'price',
    'relevancy': 'relevancy',
    'views': 'views'
};