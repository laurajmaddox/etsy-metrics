/* 
============================================================= 
Helper functions for routes + dashboard controller
=============================================================
*/

/* Returns readable search term from URL slug */
module.exports.tagFromSlug = function (slug) {
    return slug.toLowerCase()
        .replace(/[\.,\/#!$%\^&\*;:{}=_`~()]/g, '')
        .replace(/-/g, ' ');
};

/* Returns slug from search term without spaces or invalid characters */
module.exports.tagToSlug = function (search_term) {
    return search_term.toLowerCase()
        .replace(/[\.,\/#!$%\^&\*;:{}=_`~()]/g, '')
        .replace(/\s+/g, '-');
};
